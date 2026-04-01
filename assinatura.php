<?php
/**
 * assinatura.php  —  BetStat
 * ─────────────────────────────────────────────────────────────
 * Endpoint chamado pelo JS do header do site.
 * Recebe: ?email=usuario@email.com
 * Retorna: JSON com nome, vencimento e status da assinatura.
 *
 * COLOQUE ESTE ARQUIVO na raiz do seu site (mesma pasta do index.html).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.betstat.site');

$email = trim($_GET['email'] ?? '');
if (!$email) { echo json_encode(['erro' => 'email obrigatorio']); exit; }

$host = '145.223.92.222';
$user = 'lino';
$pass = '198322';
$db   = 'betanofv';
$port = 3306;

$conn = new mysqli($host, $user, $pass, $db, $port);
if ($conn->connect_error) { echo json_encode(['erro' => 'db']); exit; }
$conn->set_charset('utf8mb4');

$email_safe = $conn->real_escape_string($email);
$res = $conn->query("SELECT nome, email, inicio, duracao FROM assinantes WHERE email='$email_safe' LIMIT 1");

if (!$res || $res->num_rows === 0) {
    echo json_encode(['encontrado' => false]);
    exit;
}

$c = $res->fetch_assoc();
$venc = new DateTime($c['inicio']);
$venc->modify("+{$c['duracao']} days");
$hoje = new DateTime('today');
$dias = (int)$hoje->diff($venc)->format('%r%a'); // negativo se vencido

echo json_encode([
    'encontrado'   => true,
    'nome'         => $c['nome'],
    'email'        => $c['email'],
    'inicio'       => $c['inicio'],
    'duracao'      => $c['duracao'],
    'vencimento'   => $venc->format('Y-m-d'),
    'vencimentoBR' => $venc->format('d/m/Y'),
    'diasRestantes'=> $dias,
    'status'       => $dias < 0 ? 'vencido' : ($dias <= 5 ? 'vencendo' : 'ativo'),
    'ativo'        => $dias >= 0,
]);