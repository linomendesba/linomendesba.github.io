// build.js — ofuscador + minificador automático
// uso: node build.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC  = __dirname;       // pasta raiz (onde estão os arquivos)
const DIST = path.join(__dirname, 'dist'); // saída

// Extensões para processar
const PROCESS_JS   = ['.js'];
const PROCESS_HTML = ['.html'];

// Pastas/arquivos para IGNORAR
const IGNORE = ['dist', 'node_modules', '.vscode', 'build.js'];

// ─── Configurações do obfuscator ────────────────────────────────────────────
const OBFUSCATOR_OPTS = [
  '--compact true',
  '--control-flow-flattening false',   // true deixa muito pesado
  '--dead-code-injection false',
  '--string-array true',
  '--string-array-encoding base64',
  '--self-defending true',
].join(' ');

// ─── Configurações do html-minifier ─────────────────────────────────────────
const MINIFIER_OPTS = [
  '--collapse-whitespace',
  '--remove-comments',
  '--minify-css true',
  '--minify-js true',
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

// ─── Main ────────────────────────────────────────────────────────────────────
const files = walk(SRC);
let jsCount = 0, htmlCount = 0, copyCount = 0;

for (const file of files) {
  const ext  = path.extname(file).toLowerCase();
  const dest = destPath(file);
  ensureDir(dest);

  if (PROCESS_JS.includes(ext)) {
    try {
      execSync(`javascript-obfuscator "${file}" --output "${dest}" ${OBFUSCATOR_OPTS}`);
      console.log(`✅ JS  → ${path.relative(SRC, dest)}`);
      jsCount++;
    } catch (e) {
      console.error(`❌ JS falhou: ${file}\n${e.message}`);
      fs.copyFileSync(file, dest); // fallback: copia original
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

  } else {
    // Arquivos que não são JS/HTML: copia direto (CSS, imagens, etc.)
    fs.copyFileSync(file, dest);
    copyCount++;
  }
}

console.log(`\n🎉 Pronto!`);
console.log(`   JS ofuscados : ${jsCount}`);
console.log(`   HTML minif.  : ${htmlCount}`);
console.log(`   Copiados     : ${copyCount}`);
console.log(`   Saída em     : ${DIST}`);