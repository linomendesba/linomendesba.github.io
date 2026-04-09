// build.js — ofuscador + minificador automático (com remoção total de comentários)
// uso: node build.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC  = __dirname;
const DIST = path.join(__dirname, 'dist');

const PROCESS_JS   = ['.js'];
const PROCESS_HTML = ['.html'];
const PROCESS_CSS  = ['.css'];

const IGNORE = ['dist', 'node_modules', '.vscode', 'build.js'];

// ─── Obfuscator: sem comentários, sem strings legíveis ───────────────────────
const OBFUSCATOR_OPTS = [
  '--compact true',
  '--control-flow-flattening false',
  '--dead-code-injection false',
  '--string-array true',
  '--string-array-encoding base64',
  '--self-defending true',
  '--comments-threshold 0',        // remove todos os comentários do JS
].join(' ');

// ─── HTML minifier: remove comentários + minifica CSS/JS inline ──────────────
const MINIFIER_OPTS = [
  '--collapse-whitespace',
  '--remove-comments',                    // comentários HTML
  '--remove-comment-in-blocks true',      // comentários dentro de blocos
  '--minify-css true',                    // CSS inline (remove comentários CSS tbm)
  '--minify-js true',                     // JS inline
].join(' ');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else results.push(full);
  }
  return results;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function destPath(srcFile) {
  const rel = path.relative(SRC, srcFile);
  return path.join(DIST, rel);
}

// Remove comentários de JS puro antes de ofuscar (usando terser via node)
// Garante que /* */ e // sejam eliminados mesmo em edge cases
function stripJsComments(code) {
  // Remove blocos /* ... */ incluindo condicionais /*!
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove linha // (fora de strings — heurística simples, suficiente pós-minificação)
  code = code.replace(/(?<!https?:)\/\/[^\n]*/g, '');
  return code;
}

// Minifica CSS externo removendo comentários
function minifyCss(src, dest) {
  let css = fs.readFileSync(src, 'utf8');
  // Remove comentários /* */
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // Colapsa espaços/quebras de linha
  css = css
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\n+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  fs.writeFileSync(dest, css, 'utf8');
}

// ─── Main ────────────────────────────────────────────────────────────────────
const files = walk(SRC);
let jsCount = 0, htmlCount = 0, cssCount = 0, copyCount = 0;

for (const file of files) {
  const ext  = path.extname(file).toLowerCase();
  const dest = destPath(file);
  ensureDir(dest);

  if (PROCESS_JS.includes(ext)) {
    try {
      // 1) Strip comentários manualmente (garante remoção antes do obfuscator)
      const original = fs.readFileSync(file, 'utf8');
      const stripped = stripJsComments(original);

      // Arquivo temporário sem comentários
      const tmp = file + '.tmp.js';
      fs.writeFileSync(tmp, stripped, 'utf8');

      // 2) Ofusca o arquivo limpo
      execSync(`javascript-obfuscator "${tmp}" --output "${dest}" ${OBFUSCATOR_OPTS}`);
      fs.unlinkSync(tmp);

      console.log(`✅ JS  → ${path.relative(SRC, dest)}`);
      jsCount++;
    } catch (e) {
      console.error(`❌ JS falhou: ${file}\n${e.message}`);
      fs.copyFileSync(file, dest);
    }

  } else if (PROCESS_HTML.includes(ext)) {
    try {
      execSync(`html-minifier-terser ${MINIFIER_OPTS} -o "${dest}" "${file}"`);
      console.log(`✅ HTML → ${path.relative(SRC, dest)}`);
      htmlCount++;
    } catch (e) {
      console.error(`❌ HTML falhou: ${file}\n${e.message}`);
      fs.copyFileSync(file, dest);
    }

  } else if (PROCESS_CSS.includes(ext)) {
    try {
      minifyCss(file, dest);
      console.log(`✅ CSS  → ${path.relative(SRC, dest)}`);
      cssCount++;
    } catch (e) {
      console.error(`❌ CSS falhou: ${file}\n${e.message}`);
      fs.copyFileSync(file, dest);
    }

  } else {
    fs.copyFileSync(file, dest);
    copyCount++;
  }
}

console.log(`\n🎉 Pronto!`);
console.log(`   JS ofuscados : ${jsCount}`);
console.log(`   HTML minif.  : ${htmlCount}`);
console.log(`   CSS minif.   : ${cssCount}`);
console.log(`   Copiados     : ${copyCount}`);
console.log(`   Saída em     : ${DIST}`);