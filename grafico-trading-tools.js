(function () {
    "use strict";

    let activeTool = "select";
    let overlay = null;
    let ctx = null;
    let host = null;
    let dpr = 1;

    let objects = [];
    let selectedId = null;
    let draft = null;
    let pointerDown = false;
    let raf = 0;
    let currentLigaKey = "";

    const STORAGE_PREFIX = "caramelo:grafico:tools:v2:";

    function core() {
        return window.GraficoTradingCore;
    }

    function chart() {
        return core()?.getChart?.() || null;
    }

    function activeMarket() {
        return core()?.getActiveMarket?.() || "over25";
    }

    function marketColor() {
        return core()?.getMarketColor?.(activeMarket()) || "#60a5fa";
    }

    function ligaKey() {
        return (
            sessionStorage.getItem("ligaAtual") ||
            String(sessionStorage.getItem("datasetPath") || "copa")
                .split("/")
                .pop()
                .replace(".json", "")
                .toLowerCase() ||
            "copa"
        );
    }

    function storageKey() {
        return STORAGE_PREFIX + ligaKey();
    }

    function loadObjects() {
        currentLigaKey = ligaKey();

        try {
            const raw = localStorage.getItem(storageKey());
            const arr = raw ? JSON.parse(raw) : [];
            objects = Array.isArray(arr) ? arr : [];
        } catch {
            objects = [];
        }

        selectedId = null;
        drawSoon();
    }

    function reloadIfLigaChanged() {
        if (currentLigaKey !== ligaKey()) loadObjects();
    }

    function saveObjects() {
        try {
            localStorage.setItem(storageKey(), JSON.stringify(objects));
        } catch { }
    }

    function ensureOverlay() {
        const container = document.getElementById("graficoTradingContainer");
        if (!container) return;

        if (!overlay) {
            host = container.parentElement || container;
            host.style.position = "relative";

            overlay = document.createElement("canvas");
            overlay.id = "gtOverlayCanvas";

            host.appendChild(overlay);
            ctx = overlay.getContext("2d", { alpha: true });

            overlay.addEventListener("pointerdown", onPointerDown);
            overlay.addEventListener("pointermove", onPointerMove);
            overlay.addEventListener("pointerup", onPointerUp);
            overlay.addEventListener("pointercancel", cancelAction);
            overlay.addEventListener("dblclick", onDoubleClick);

            window.addEventListener("keydown", onKeyDown);
            window.addEventListener("resize", resizeOverlay);
        }

        resizeOverlay();
        if (!currentLigaKey) loadObjects();
        setTool(activeTool);
    }

    function resizeOverlay() {
        if (!overlay) return;

        const container = document.getElementById("graficoTradingContainer");
        if (!container) return;

        const rect = container.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;

        overlay.width = Math.max(1, Math.floor(rect.width * dpr));
        overlay.height = Math.max(1, Math.floor(rect.height * dpr));
        overlay.style.width = rect.width + "px";
        overlay.style.height = rect.height + "px";

        ctx = overlay.getContext("2d", { alpha: true });
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        drawSoon();
    }

    function onOpen() {
        ensureOverlay();
        resizeOverlay();
        reloadIfLigaChanged();
        drawSoon();
    }

    function getPoint(e) {
        const rect = overlay.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function xFromLogical(x) {
        const v = chart()?.timeScale()?.logicalToCoordinate?.(x);
        return Number.isFinite(v) ? v : null;
    }

    function logicalFromX(x) {
        const v = chart()?.timeScale()?.coordinateToLogical?.(x);
        return Number.isFinite(v) ? v : null;
    }

    function getPriceSeries() {
        const key = activeMarket();
        return core()?.getSeries?.()?.[key] || null;
    }

    function yFromPrice(y) {
        const s = getPriceSeries();
        const v = s?.priceToCoordinate?.(y);
        return Number.isFinite(v) ? v : null;
    }

    function priceFromY(y) {
        const s = getPriceSeries();
        const v = s?.coordinateToPrice?.(y);
        return Number.isFinite(v) ? v : null;
    }

    function addObject(obj) {
        const item = {
            id: "gt_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7),
            market: activeMarket(),
            color: marketColor(),
            ...obj
        };

        objects.push(item);
        selectedId = item.id;

        saveObjects();
        drawSoon();
    }

    function addCurrentLine() {
        ensureOverlay();

        const value = core()?.getLastValue?.(activeMarket());
        if (!Number.isFinite(value)) return;

        addObject({
            type: "hline",
            y: value,
            color: marketColor()
        });
    }

    function deleteSelected() {
        if (!selectedId) return;

        objects = objects.filter((o) => o.id !== selectedId);
        selectedId = null;

        saveObjects();
        drawSoon();
    }

    function clearAll() {
        objects = [];
        selectedId = null;
        saveObjects();
        drawSoon();
    }

    function dispatchToolChange() {
        window.dispatchEvent(new CustomEvent("gt:toolchange", {
            detail: { tool: activeTool }
        }));
    }

   function setTool(tool) {
    activeTool = tool || "select";
    draft = null;
    pointerDown = false;

    if (!overlay) {
        dispatchToolChange();
        return;
    }

    const captureTools = ["line", "vertical", "trend", "zone", "text", "delete"];
    const shouldCapture = captureTools.includes(activeTool);

    overlay.style.pointerEvents = shouldCapture ? "auto" : "none";

    overlay.style.cursor =
        activeTool === "select" ? "default" :
        activeTool === "delete" ? "not-allowed" :
        activeTool === "text" ? "text" :
        "crosshair";

    dispatchToolChange();
    drawSoon();
}

    function onPointerDown(e) {
        if (!overlay) return;

        const p = getPoint(e);
        pointerDown = true;

        try {
            overlay.setPointerCapture(e.pointerId);
        } catch { }

        if (activeTool === "select") {
            const hit = hitTest(p);

            if (hit) {
                selectedId = hit.id;
            } else {
                selectedId = null;
            }

            drawSoon();
            return;
        }

        if (activeTool === "line") {
            const y = priceFromY(p.y);
            if (Number.isFinite(y)) addObject({ type: "hline", y });
            setTool("select");
            return;
        }

        if (activeTool === "vertical") {
            const x = logicalFromX(p.x);
            if (Number.isFinite(x)) addObject({ type: "vline", x });
            setTool("select");
            return;
        }

        if (activeTool === "trend") {
            draft = {
                type: "trend",
                x1: logicalFromX(p.x),
                y1: priceFromY(p.y),
                x2: logicalFromX(p.x),
                y2: priceFromY(p.y),
                color: marketColor()
            };
            drawSoon();
            return;
        }

        if (activeTool === "zone") {
            draft = {
                type: "zone",
                x1: logicalFromX(p.x),
                y1: priceFromY(p.y),
                x2: logicalFromX(p.x),
                y2: priceFromY(p.y),
                color: marketColor()
            };
            drawSoon();
            return;
        }

        if (activeTool === "text") {
            openTextEditor(p);
            return;
        }

        if (activeTool === "delete") {
            const hit = hitTest(p);
            if (hit) {
                selectedId = hit.id;
                deleteSelected();
            }
            setTool("select");
        }
    }

    function onPointerMove(e) {
        if (!pointerDown || !draft) return;

        const p = getPoint(e);

        if (draft.type === "trend" || draft.type === "zone") {
            draft.x2 = logicalFromX(p.x);
            draft.y2 = priceFromY(p.y);
            drawSoon();
        }
    }

    function onPointerUp(e) {
        pointerDown = false;

        try {
            overlay?.releasePointerCapture(e.pointerId);
        } catch { }

        if (draft?.type === "trend") {
            if (validDraft(draft)) {
                addObject({
                    type: "trend",
                    x1: draft.x1,
                    y1: draft.y1,
                    x2: draft.x2,
                    y2: draft.y2,
                    color: draft.color
                });
            }

            draft = null;
            setTool("select");
            return;
        }

        if (draft?.type === "zone") {
            if (validDraft(draft)) {
                addObject({
                    type: "zone",
                    x1: draft.x1,
                    y1: draft.y1,
                    x2: draft.x2,
                    y2: draft.y2,
                    color: draft.color
                });
            }

            draft = null;
            setTool("select");
        }
    }

    function cancelAction() {
        pointerDown = false;
        draft = null;
        drawSoon();
    }

    function onDoubleClick(e) {
        const hit = hitTest(getPoint(e));
        if (!hit || hit.type !== "text") return;
        openTextEditor(getPoint(e), hit);
    }

    function onKeyDown(e) {
        if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
            deleteSelected();
        }

        if (e.key === "Escape") {
            selectedId = null;
            draft = null;
            setTool("select");
            drawSoon();
        }
    }

    function openTextEditor(point, existing = null) {
        if (!host) return;

        const input = document.createElement("input");
        input.type = "text";
        input.value = existing?.text || "";
        input.placeholder = "Texto";
        input.className = "gt-text-editor";
        input.style.left = Math.max(8, point.x) + "px";
        input.style.top = Math.max(8, point.y) + "px";

        host.appendChild(input);
        input.focus();
        input.select();

        function commit() {
            const text = input.value.trim();
            input.remove();

            if (!text) {
                setTool("select");
                return;
            }

            if (existing) {
                existing.text = text;
                saveObjects();
                drawSoon();
            } else {
                const x = logicalFromX(point.x);
                const y = priceFromY(point.y);

                if (Number.isFinite(x) && Number.isFinite(y)) {
                    addObject({ type: "text", x, y, text });
                }
            }

            setTool("select");
        }

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") commit();

            if (e.key === "Escape") {
                input.remove();
                setTool("select");
            }
        });

        input.addEventListener("blur", commit, { once: true });
    }

    function validDraft(d) {
        return (
            [d.x1, d.y1, d.x2, d.y2].every(Number.isFinite) &&
            (Math.abs(d.x2 - d.x1) > 0.15 || Math.abs(d.y2 - d.y1) > 0.15)
        );
    }

    function drawSoon() {
        if (raf) return;

        raf = requestAnimationFrame(() => {
            raf = 0;
            draw();
        });
    }

    function draw() {
        if (!ctx || !overlay) return;

        const rect = overlay.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        objects.forEach((obj) => {
            drawObject(obj, obj.id === selectedId);
        });

        if (draft) drawObject(draft, true, true);
    }

    function drawObject(obj, selected = false, preview = false) {
        const color = obj.color || marketColor();

        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = selected ? 2 : 1.15;
        ctx.setLineDash(preview ? [4, 4] : selected ? [5, 3] : []);

        if (obj.type === "hline") {
            const y = yFromPrice(obj.y);
            if (Number.isFinite(y)) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(overlay.width / dpr, y);
                ctx.stroke();
            }
        }

        if (obj.type === "vline") {
            const x = xFromLogical(obj.x);
            if (Number.isFinite(x)) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, overlay.height / dpr);
                ctx.stroke();
            }
        }

        if (obj.type === "trend") {
            const x1 = xFromLogical(obj.x1);
            const y1 = yFromPrice(obj.y1);
            const x2 = xFromLogical(obj.x2);
            const y2 = yFromPrice(obj.y2);

            if ([x1, y1, x2, y2].every(Number.isFinite)) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }

        if (obj.type === "zone") {
            const x1 = xFromLogical(obj.x1);
            const y1 = yFromPrice(obj.y1);
            const x2 = xFromLogical(obj.x2);
            const y2 = yFromPrice(obj.y2);

            if ([x1, y1, x2, y2].every(Number.isFinite)) {
                const left = Math.min(x1, x2);
                const top = Math.min(y1, y2);
                const w = Math.abs(x2 - x1);
                const h = Math.abs(y2 - y1);

                ctx.fillStyle = hexToRgba(color, 0.13);
                ctx.fillRect(left, top, w, h);
                ctx.strokeRect(left, top, w, h);
            }
        }

        if (obj.type === "text") {
            const x = xFromLogical(obj.x);
            const y = yFromPrice(obj.y);

            if ([x, y].every(Number.isFinite)) {
                ctx.setLineDash([]);
                ctx.font = selected
                    ? "900 13px system-ui, Segoe UI, sans-serif"
                    : "800 12px system-ui, Segoe UI, sans-serif";
                ctx.textBaseline = "middle";
                ctx.fillText(obj.text || "Texto", x, y);
            }
        }

        ctx.restore();
    }

    function hitTest(p) {
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];

            if (obj.type === "hline") {
                const y = yFromPrice(obj.y);
                if (Number.isFinite(y) && Math.abs(p.y - y) <= 8) return obj;
            }

            if (obj.type === "vline") {
                const x = xFromLogical(obj.x);
                if (Number.isFinite(x) && Math.abs(p.x - x) <= 8) return obj;
            }

            if (obj.type === "trend") {
                if (pointNearSegment(p, obj)) return obj;
            }

            if (obj.type === "zone") {
                if (pointInZone(p, obj)) return obj;
            }

            if (obj.type === "text") {
                const x = xFromLogical(obj.x);
                const y = yFromPrice(obj.y);

                if (
                    Number.isFinite(x) &&
                    Number.isFinite(y) &&
                    Math.abs(p.x - x) <= 80 &&
                    Math.abs(p.y - y) <= 18
                ) {
                    return obj;
                }
            }
        }

        return null;
    }

    function pointNearSegment(p, obj) {
        const x1 = xFromLogical(obj.x1);
        const y1 = yFromPrice(obj.y1);
        const x2 = xFromLogical(obj.x2);
        const y2 = yFromPrice(obj.y2);

        if (![x1, y1, x2, y2].every(Number.isFinite)) return false;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const len2 = dx * dx + dy * dy;

        if (!len2) return Math.hypot(p.x - x1, p.y - y1) <= 8;

        let t = ((p.x - x1) * dx + (p.y - y1) * dy) / len2;
        t = Math.max(0, Math.min(1, t));

        const px = x1 + t * dx;
        const py = y1 + t * dy;

        return Math.hypot(p.x - px, p.y - py) <= 8;
    }

    function pointInZone(p, obj) {
        const x1 = xFromLogical(obj.x1);
        const y1 = yFromPrice(obj.y1);
        const x2 = xFromLogical(obj.x2);
        const y2 = yFromPrice(obj.y2);

        if (![x1, y1, x2, y2].every(Number.isFinite)) return false;

        const left = Math.min(x1, x2);
        const right = Math.max(x1, x2);
        const top = Math.min(y1, y2);
        const bottom = Math.max(y1, y2);

        return p.x >= left && p.x <= right && p.y >= top && p.y <= bottom;
    }

    function hexToRgba(hex, alpha = 1) {
        const clean = String(hex || "#60a5fa").replace("#", "");
        const full = clean.length === 3
            ? clean.split("").map((c) => c + c).join("")
            : clean;

        const num = parseInt(full, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;

        return `rgba(${r},${g},${b},${alpha})`;
    }

    document.addEventListener("DOMContentLoaded", () => {
        ensureOverlay();

        document.getElementById("btnGraficoDelete")?.addEventListener("click", (e) => {
            if (selectedId) {
                deleteSelected();
                return;
            }

            if (e.shiftKey) clearAll();
        });
    });

    window.GraficoTradingTools = {
        setTool,
        redraw: drawSoon,
        resize: resizeOverlay,
        reload: loadObjects,
        reloadIfLigaChanged,
        clearAll,
        onOpen,
        addCurrentLine
    };
})();