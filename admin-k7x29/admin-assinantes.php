<?php
// ── CONEXÃO DIRETA AO MYSQL ──────────────────────────────────────────────
$host = '145.223.92.222';
$user = 'lino';
$pass = '198322';
$db   = 'betanofv';
$port = 3306;

$conn = new mysqli($host, $user, $pass, $db, $port);
if ($conn->connect_error) {
    die(json_encode(['erro' => $conn->connect_error]));
}
$conn->set_charset('utf8mb4');

// Cria tabela se não existir
$conn->query("
  CREATE TABLE IF NOT EXISTS assinantes (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    inicio    DATE NOT NULL,
    duracao   INT NOT NULL DEFAULT 30,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
");

// ── AÇÕES AJAX ───────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = $_POST['acao'] ?? '';

    if ($acao === 'listar') {
        $res = $conn->query("SELECT * FROM assinantes ORDER BY inicio ASC");
        $rows = [];
        while ($r = $res->fetch_assoc()) $rows[] = $r;
        echo json_encode($rows);
        exit;
    }

    if ($acao === 'salvar') {
        $id      = intval($_POST['id'] ?? 0);
        $nome    = $conn->real_escape_string($_POST['nome']);
        $email   = $conn->real_escape_string($_POST['email']);
        $inicio  = $conn->real_escape_string($_POST['inicio']);
        $duracao = intval($_POST['duracao']);

        if ($id > 0) {
            $conn->query("UPDATE assinantes SET nome='$nome', email='$email', inicio='$inicio', duracao=$duracao WHERE id=$id");
            echo json_encode(['ok' => true]);
        } else {
            $conn->query("INSERT INTO assinantes (nome, email, inicio, duracao) VALUES ('$nome','$email','$inicio',$duracao)");
            echo json_encode(['ok' => true, 'id' => $conn->insert_id]);
        }
        exit;
    }

    if ($acao === 'remover') {
        $id = intval($_POST['id']);
        $conn->query("DELETE FROM assinantes WHERE id=$id");
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($acao === 'importar') {
        $clientes = json_decode($_POST['clientes'], true);
        $ok = 0; $fail = 0;
        foreach ($clientes as $c) {
            $nome    = $conn->real_escape_string($c['nome']);
            $email   = $conn->real_escape_string($c['email']);
            $inicio  = $conn->real_escape_string($c['inicio']);
            $duracao = intval($c['duracao']);
            $r = $conn->query("INSERT IGNORE INTO assinantes (nome, email, inicio, duracao) VALUES ('$nome','$email','$inicio',$duracao)");
            $r ? $ok++ : $fail++;
        }
        echo json_encode(['ok' => $ok, 'fail' => $fail]);
        exit;
    }
}

// ── HTML ─────────────────────────────────────────────────────────────────
// Verifica se há clientes já no banco
$totalBanco = $conn->query("SELECT COUNT(*) as c FROM assinantes")->fetch_assoc()['c'];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BetStat · Admin Assinantes</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg:#0a0f0d; --surface:#111915; --card:#141c18; --border:#1e2b23;
      --green:#1fac89; --green-dim:#1fac8922; --red:#e05252; --red-dim:#e0525222;
      --yellow:#e0b84e; --yellow-dim:#e0b84e22;
      --text:#e8f0ec; --muted:#7a9488;
      --font:'Syne',sans-serif; --mono:'DM Mono',monospace;
    }
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh}

    header{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;
      border-bottom:1px solid var(--border);background:var(--surface);position:sticky;top:0;z-index:100}
    .logo{font-size:20px;font-weight:800;letter-spacing:-.5px}
    .logo span{color:var(--green)}
    .header-stats{display:flex;gap:24px}
    .hstat{text-align:center}
    .hstat-val{font-size:22px;font-weight:700;color:var(--green);font-family:var(--mono)}
    .hstat-val.warn{color:var(--yellow)} .hstat-val.danger{color:var(--red)}
    .hstat-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px}

    .toolbar{display:flex;gap:12px;padding:20px 32px;flex-wrap:wrap;align-items:center}
    .search-box{flex:1;min-width:200px;background:var(--card);border:1px solid var(--border);
      border-radius:8px;padding:10px 16px;color:var(--text);font-family:var(--font);
      font-size:14px;outline:none;transition:border-color .2s}
    .search-box:focus{border-color:var(--green)}
    .filter-btn{padding:10px 18px;border-radius:8px;border:1px solid var(--border);
      background:var(--card);color:var(--muted);font-family:var(--font);font-size:13px;
      cursor:pointer;transition:all .2s}
    .filter-btn.active{border-color:var(--green);color:var(--green);background:var(--green-dim)}
    .btn-novo{padding:10px 22px;border-radius:8px;border:none;background:var(--green);
      color:#0a0f0d;font-family:var(--font);font-weight:700;font-size:13px;cursor:pointer;
      transition:opacity .2s;margin-left:auto}
    .btn-novo:hover{opacity:.85}

    .import-note{margin:0 32px 20px;padding:14px 18px;background:var(--yellow-dim);
      border:1px solid var(--yellow);border-radius:10px;font-size:13px;color:var(--yellow);
      display:flex;align-items:center;gap:10px}
    .import-note.hidden{display:none}
    .btn-importar{margin-left:auto;padding:6px 16px;border-radius:6px;border:1px solid var(--yellow);
      background:transparent;color:var(--yellow);font-family:var(--font);cursor:pointer;font-weight:700}

    .table-wrap{padding:0 32px 40px;overflow-x:auto}
    table{width:100%;border-collapse:collapse}
    thead th{text-align:left;padding:12px 16px;font-size:11px;text-transform:uppercase;
      letter-spacing:1px;color:var(--muted);border-bottom:1px solid var(--border)}
    tbody tr{border-bottom:1px solid var(--border);transition:background .15s}
    tbody tr:hover{background:var(--card)}
    tbody td{padding:14px 16px;font-size:14px;vertical-align:middle}
    .nome-cel{font-weight:600}
    .email-cel{color:var(--muted);font-family:var(--mono);font-size:12px}
    .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;font-family:var(--mono)}
    .badge-ativo{background:var(--green-dim);color:var(--green)}
    .badge-vencendo{background:var(--yellow-dim);color:var(--yellow)}
    .badge-vencido{background:var(--red-dim);color:var(--red)}
    .dias-cel{font-family:var(--mono);font-weight:700;font-size:15px}
    .dias-ok{color:var(--green)} .dias-warn{color:var(--yellow)} .dias-danger{color:var(--red)}
    .acoes{display:flex;gap:8px}
    .btn-acao{padding:6px 14px;border-radius:6px;border:1px solid var(--border);
      background:transparent;color:var(--muted);font-family:var(--font);font-size:12px;cursor:pointer;transition:all .15s}
    .btn-acao:hover{border-color:var(--green);color:var(--green)}
    .btn-acao.danger:hover{border-color:var(--red);color:var(--red)}
    .btn-acao.renovar:hover{border-color:var(--yellow);color:var(--yellow)}

    .overlay{position:fixed;inset:0;background:#000c;backdrop-filter:blur(4px);
      display:none;align-items:center;justify-content:center;z-index:200}
    .overlay.open{display:flex}
    .modal{background:var(--surface);border:1px solid var(--border);border-radius:16px;
      padding:32px;width:480px;max-width:95vw;animation:pop .2s ease}
    @keyframes pop{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
    .modal-title{font-size:20px;font-weight:800;margin-bottom:24px}
    .modal-title span{color:var(--green)}
    .form-group{margin-bottom:16px}
    .form-group label{display:block;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px}
    .form-group input,.form-group select{width:100%;background:var(--card);border:1px solid var(--border);
      border-radius:8px;padding:10px 14px;color:var(--text);font-family:var(--font);font-size:14px;outline:none;transition:border-color .2s}
    .form-group input:focus,.form-group select:focus{border-color:var(--green)}
    .form-group select option{background:var(--card)}
    .modal-actions{display:flex;gap:12px;margin-top:24px;justify-content:flex-end}
    .btn-cancel{padding:10px 20px;border-radius:8px;border:1px solid var(--border);
      background:transparent;color:var(--muted);font-family:var(--font);font-size:14px;cursor:pointer}
    .btn-save{padding:10px 24px;border-radius:8px;border:none;background:var(--green);
      color:#0a0f0d;font-family:var(--font);font-weight:700;font-size:14px;cursor:pointer}

    #toast{position:fixed;bottom:32px;right:32px;background:var(--green);color:#0a0f0d;
      padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;
      opacity:0;transform:translateY(20px);transition:all .3s;z-index:999;pointer-events:none}
    #toast.show{opacity:1;transform:translateY(0)}
    #toast.err{background:var(--red);color:#fff}

    .empty-state{text-align:center;padding:60px 0;color:var(--muted)}
    .empty-state .big{font-size:48px;margin-bottom:12px}
  </style>
</head>
<body>

<header>
  <div class="logo">Bet<span>Stat</span> · Admin</div>
  <div class="header-stats">
    <div class="hstat"><div class="hstat-val" id="h-total">…</div><div class="hstat-lbl">Total</div></div>
    <div class="hstat"><div class="hstat-val" id="h-ativos">…</div><div class="hstat-lbl">Ativos</div></div>
    <div class="hstat"><div class="hstat-val warn" id="h-vencendo">…</div><div class="hstat-lbl">Vencendo</div></div>
    <div class="hstat"><div class="hstat-val danger" id="h-vencidos">…</div><div class="hstat-lbl">Vencidos</div></div>
  </div>
</header>

<div class="import-note <?= $totalBanco > 0 ? 'hidden' : '' ?>" id="importNote">
  ⚠️ Banco vazio — importe os <strong>43 clientes atuais</strong> com um clique:
  <button class="btn-importar" onclick="importarClientes()">Importar Atuais</button>
</div>

<div class="toolbar">
  <input type="text" class="search-box" id="busca" placeholder="Buscar por nome ou email…" oninput="renderTabela()" />
  <button class="filter-btn active" onclick="setFiltro('todos',this)">Todos</button>
  <button class="filter-btn" onclick="setFiltro('ativo',this)">Ativos</button>
  <button class="filter-btn" onclick="setFiltro('vencendo',this)">Vencendo</button>
  <button class="filter-btn" onclick="setFiltro('vencido',this)">Vencidos</button>
  <button class="btn-novo" onclick="abrirModal()">+ Novo Cliente</button>
</div>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Nome</th><th>Email</th><th>Início</th><th>Vencimento</th>
        <th>Dias</th><th>Status</th><th>Ações</th>
      </tr>
    </thead>
    <tbody id="tabela-body"></tbody>
  </table>
  <div class="empty-state hidden" id="empty">
    <div class="big">🔍</div>Nenhum cliente encontrado.
  </div>
</div>

<!-- Modal -->
<div class="overlay" id="overlay">
  <div class="modal">
    <div class="modal-title" id="modal-title">Novo <span>Cliente</span></div>
    <div class="form-group"><label>Nome</label><input type="text" id="f-nome" /></div>
    <div class="form-group"><label>Email (mesmo do login Firebase)</label><input type="email" id="f-email" /></div>
    <div class="form-group"><label>Data de Início</label><input type="date" id="f-inicio" /></div>
    <div class="form-group">
      <label>Duração</label>
      <select id="f-duracao">
        <option value="30">30 dias</option>
        <option value="60">60 dias</option>
        <option value="90">90 dias</option>
        <option value="180">180 dias</option>
        <option value="365">365 dias</option>
      </select>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="fecharModal()">Cancelar</button>
      <button class="btn-save" onclick="salvarCliente()">Salvar</button>
    </div>
  </div>
</div>

<div id="toast"></div>

<script>
const ME = location.pathname; // chama o próprio arquivo PHP
let clientes = [], filtroAtual = 'todos', editandoId = null;

// ── CLIENTES INICIAIS PARA IMPORTAR ──────────────────────────────────────
const INICIAIS = [
  {nome:'Diego',         email:'souzadyego30@gmail.com',            inicio:'2026-03-04',duracao:30},
  {nome:'Alves',         email:'pewolneyoliveira@gmail.com',         inicio:'2026-03-03',duracao:30},
  {nome:'Thiago',        email:'thiagombpublicidade@gmail.com',      inicio:'2026-03-02',duracao:30},
  {nome:'Robson',        email:'robsonsadias@gmail.com',             inicio:'2026-02-01',duracao:60},
  {nome:'Erica',         email:'camarae317@gmail.com',               inicio:'2026-02-01',duracao:60},
  {nome:'José Ferreira', email:'joseluizferreirapires211@gmail.com', inicio:'2026-03-31',duracao:30},
  {nome:'Dani',          email:'danielhandrey@gmail.com',            inicio:'2026-03-31',duracao:60},
  {nome:'Caramelho',     email:'juscelinomendesba@gmail.com',        inicio:'2026-03-31',duracao:30},
  {nome:'Admilson',      email:'ademilsondss@hotmail.com',           inicio:'2026-03-31',duracao:30},
  {nome:'Francisco',     email:'francinaldo_diniz@hotmail.com',      inicio:'2026-03-30',duracao:30},
  {nome:'Vitor Corvino', email:'victor.chaves.corvino@gmail.com',    inicio:'2026-03-30',duracao:30},
  {nome:'Gil',           email:'azevedo.garu@hotmail.com',           inicio:'2026-03-29',duracao:30},
  {nome:'Ph',            email:'pedroamorimpe52@gmail.com',          inicio:'2026-03-29',duracao:30},
  {nome:'Ricardo',       email:'ricardo_sk82@hotmail.com',           inicio:'2026-03-24',duracao:30},
  {nome:'Range',         email:'rangelheitor8@gmail.com',            inicio:'2026-03-23',duracao:30},
  {nome:'Wesley Lopes',  email:'wesley_404@hotmail.com',             inicio:'2026-03-23',duracao:30},
  {nome:'Fabiano',       email:'pires.fabiano.fp1@gmail.com',        inicio:'2026-03-22',duracao:30},
  {nome:'Wil',           email:'willianrocha500@hotmail.com',        inicio:'2026-03-22',duracao:30},
  {nome:'Pedro',         email:'ppedro.lucas617@gmail.com',          inicio:'2026-03-21',duracao:30},
  {nome:'Everton',       email:'evertoncsa.lima@gmail.com',          inicio:'2026-03-20',duracao:30},
  {nome:'Pedro Diniz',   email:'pedrodinizoficial123@gmail.com',     inicio:'2026-03-20',duracao:30},
  {nome:'Junior',        email:'nelsoncamargo@msn.com',              inicio:'2026-03-20',duracao:30},
  {nome:'Heitor',        email:'hhb_563@hotmail.com',                inicio:'2026-03-20',duracao:30},
  {nome:'Christiane',    email:'monteirocmsilva@gmail.com',          inicio:'2026-03-20',duracao:30},
  {nome:'Sergio 3',      email:'paulotrigueiro81@gmail.com',         inicio:'2026-03-19',duracao:30},
  {nome:'Hebert',        email:'hmendesvigia@gmail.com',             inicio:'2026-03-18',duracao:30},
  {nome:'Sergio',        email:'taufla@outlook.com',                 inicio:'2026-03-18',duracao:30},
  {nome:'Michael',       email:'tatimichael@hotmail.com',            inicio:'2026-03-18',duracao:30},
  {nome:'Lucas',         email:'lucasworqk@gmail.com',              inicio:'2026-03-17',duracao:30},
  {nome:'Edi',           email:'edsontrecho@gmail.com',              inicio:'2026-03-17',duracao:30},
  {nome:'Jg',            email:'Mj383306@gmail.com',                 inicio:'2026-03-17',duracao:30},
  {nome:'Vitor Souza',   email:'vyuk87@gmail.com',                   inicio:'2026-03-13',duracao:30},
  {nome:'DAVIH',         email:'claudineihdavid@gmail.com',          inicio:'2026-03-10',duracao:30},
  {nome:'Leo',           email:'leo10495@hotmail.com',               inicio:'2026-03-08',duracao:30},
  {nome:'Julio',         email:'juliovaz1000@gmail.com',             inicio:'2026-03-07',duracao:30},
  {nome:'Victor Rodrigues',email:'Docvicrod@gmail.com',              inicio:'2026-02-27',duracao:60},
  {nome:'Luiz Gustavo',  email:'nocasco13@gmail.com',                inicio:'2026-02-21',duracao:60},
  {nome:'Wanderlei',     email:'wendlererinaldo7@gmail.com',         inicio:'2026-01-28',duracao:90},
  {nome:'Marcio',        email:'marciolulu34@gmail.com',             inicio:'2026-01-16',duracao:60},
  {nome:'Denis',         email:'jdenis2019@gmail.com',               inicio:'2026-01-16',duracao:60},
  {nome:'Claudinei',     email:'claudiodejesusalvesalves1@gmail.com',inicio:'2026-01-15',duracao:60},
  {nome:'Casemiro',      email:'jhota.casemiro@gmail.com',           inicio:'2025-12-15',duracao:60},
  {nome:'Cassio',        email:'cassioscheffer87@gmail.com',         inicio:'2025-07-23',duracao:365},
];

// ── AJAX ─────────────────────────────────────────────────────────────────
async function php(dados) {
  const fd = new FormData();
  for (const k in dados) fd.append(k, dados[k]);
  const r = await fetch(ME, { method: 'POST', body: fd });
  return r.json();
}

// ── INIT ──────────────────────────────────────────────────────────────────
async function carregarClientes() {
  clientes = await php({ acao: 'listar' });
  atualizarHeader();
  renderTabela();
}

async function importarClientes() {
  const btn = document.querySelector('.btn-importar');
  btn.textContent = 'Importando…';
  btn.disabled = true;
  const res = await php({ acao: 'importar', clientes: JSON.stringify(INICIAIS) });
  toast(`✅ ${res.ok} clientes importados!`);
  document.getElementById('importNote').classList.add('hidden');
  carregarClientes();
}

// ── UTILITÁRIOS ───────────────────────────────────────────────────────────
function diasRestantes(inicio, duracao) {
  const v = new Date(inicio); v.setDate(v.getDate() + +duracao);
  const h = new Date(); h.setHours(0,0,0,0); v.setHours(0,0,0,0);
  return Math.floor((v - h) / 86400000);
}
function dataVenc(inicio, duracao) {
  const d = new Date(inicio); d.setDate(d.getDate() + +duracao);
  return d.toLocaleDateString('pt-BR');
}
function status(dias) { return dias < 0 ? 'vencido' : dias <= 5 ? 'vencendo' : 'ativo'; }
function badge(s) {
  const m = {ativo:['badge-ativo','Ativo'],vencendo:['badge-vencendo','Vencendo'],vencido:['badge-vencido','Vencido']};
  return `<span class="badge ${m[s][0]}">${m[s][1]}</span>`;
}
function diasHTML(d) {
  const c = d < 0 ? 'dias-danger' : d <= 5 ? 'dias-warn' : 'dias-ok';
  const t = d < 0 ? `${d}d` : d === 0 ? 'hoje!' : `${d}d`;
  return `<span class="dias-cel ${c}">${t}</span>`;
}
function toast(msg, err=false) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'show' + (err?' err':'');
  setTimeout(()=>t.className='', 3000);
}

// ── FILTRO ────────────────────────────────────────────────────────────────
function setFiltro(f, btn) {
  filtroAtual = f;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderTabela();
}

// ── RENDER ────────────────────────────────────────────────────────────────
function renderTabela() {
  const busca = document.getElementById('busca').value.toLowerCase();
  let lista = clientes.filter(c => {
    const d = diasRestantes(c.inicio, c.duracao);
    const s = status(d);
    const mF = filtroAtual === 'todos' || s === filtroAtual;
    const mB = !busca || c.nome.toLowerCase().includes(busca) || c.email.toLowerCase().includes(busca);
    return mF && mB;
  }).sort((a,b)=>diasRestantes(a.inicio,a.duracao)-diasRestantes(b.inicio,b.duracao));

  const tbody = document.getElementById('tabela-body');
  document.getElementById('empty').classList.toggle('hidden', lista.length > 0);
  if (!lista.length) { tbody.innerHTML=''; return; }

  tbody.innerHTML = lista.map(c => {
    const d = diasRestantes(c.inicio, c.duracao);
    const iFmt = new Date(c.inicio+'T12:00:00').toLocaleDateString('pt-BR');
    return `<tr>
      <td class="nome-cel">${c.nome}</td>
      <td class="email-cel">${c.email}</td>
      <td>${iFmt}</td>
      <td>${dataVenc(c.inicio, c.duracao)}</td>
      <td>${diasHTML(d)}</td>
      <td>${badge(status(d))}</td>
      <td><div class="acoes">
        <button class="btn-acao" onclick="editarCliente(${c.id})">Editar</button>
        <button class="btn-acao renovar" onclick="renovarCliente(${c.id})">Renovar</button>
        <button class="btn-acao danger" onclick="removerCliente(${c.id})">Remover</button>
      </div></td>
    </tr>`;
  }).join('');
}

function atualizarHeader() {
  let at=0,ve=0,vi=0;
  clientes.forEach(c=>{ const s=status(diasRestantes(c.inicio,c.duracao)); if(s==='ativo')at++; if(s==='vencendo')ve++; if(s==='vencido')vi++; });
  document.getElementById('h-total').textContent=clientes.length;
  document.getElementById('h-ativos').textContent=at;
  document.getElementById('h-vencendo').textContent=ve;
  document.getElementById('h-vencidos').textContent=vi;
}

// ── MODAL ─────────────────────────────────────────────────────────────────
function abrirModal(id=null) {
  editandoId=id;
  document.getElementById('overlay').classList.add('open');
  if (id) {
    const c=clientes.find(x=>x.id==id);
    document.getElementById('modal-title').innerHTML='Editar <span>Cliente</span>';
    document.getElementById('f-nome').value=c.nome;
    document.getElementById('f-email').value=c.email;
    document.getElementById('f-inicio').value=c.inicio;
    document.getElementById('f-duracao').value=c.duracao;
  } else {
    document.getElementById('modal-title').innerHTML='Novo <span>Cliente</span>';
    document.getElementById('f-nome').value='';
    document.getElementById('f-email').value='';
    document.getElementById('f-inicio').value=new Date().toISOString().split('T')[0];
    document.getElementById('f-duracao').value='30';
  }
}
function fecharModal(){ document.getElementById('overlay').classList.remove('open'); editandoId=null; }
function editarCliente(id){ abrirModal(id); }

async function salvarCliente() {
  const dados = { acao:'salvar', id:editandoId||0,
    nome:document.getElementById('f-nome').value.trim(),
    email:document.getElementById('f-email').value.trim(),
    inicio:document.getElementById('f-inicio').value,
    duracao:document.getElementById('f-duracao').value };
  if (!dados.nome||!dados.email||!dados.inicio){ toast('Preencha todos os campos.',true); return; }
  await php(dados);
  fecharModal();
  await carregarClientes();
  toast(editandoId?'Cliente atualizado!':'Cliente adicionado! ✅');
}

async function renovarCliente(id) {
  const c=clientes.find(x=>x.id==id);
  const hoje=new Date().toISOString().split('T')[0];
  await php({acao:'salvar',id,nome:c.nome,email:c.email,inicio:hoje,duracao:c.duracao});
  await carregarClientes();
  toast(`${c.nome} renovado por mais ${c.duracao} dias! 🎉`);
}

async function removerCliente(id) {
  const c=clientes.find(x=>x.id==id);
  if (!confirm(`Remover ${c.nome}?`)) return;
  await php({acao:'remover',id});
  await carregarClientes();
  toast(`${c.nome} removido.`,true);
}

document.getElementById('overlay').addEventListener('click',e=>{ if(e.target===document.getElementById('overlay')) fecharModal(); });

carregarClientes();
</script>
</body>
</html>