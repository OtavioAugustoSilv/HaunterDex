<?php
require 'php/db.php';

// Inicializa variáveis do popup
$popup_mensagem = '';
$popup_tipo = '';

$mensagem_enviada = false;
$erro = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $cpf = $_POST['cpf'];
    $assunto = $_POST['assunto'];
    $mensagem = $_POST['mensagem'];

    $stmt = $pdo->prepare("INSERT INTO mensagens (nome,email,cpf,assunto,mensagem) VALUES (?,?,?,?,?)");
    try {
        $stmt->execute([$nome, $email, $cpf, $assunto, $mensagem]);
        $mensagem_enviada = true;
    } catch (Exception $e) {
        $erro = true;
    }

    // Define popup de acordo com o resultado
    if ($mensagem_enviada) {
        $popup_mensagem = "Mensagem enviada com sucesso!";
        $popup_tipo = "sucesso";
    } elseif ($erro) {
        $popup_mensagem = "Erro ao enviar mensagem.";
        $popup_tipo = "erro";
    }
}
?>


<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Haunter Dex - Contato</title>
  <link rel="stylesheet" href="css/haunterDex_base.css" />
  <link rel="stylesheet" href="css/contato.css" />
  <link rel="stylesheet" href="css/switch.css" />
  <link rel="stylesheet" href="css/popup.css">
  <script src="js/validacao.js"></script>
  <script src="js/themeToggle.js"></script>
  <script src="js/theme.js"></script>
</head>
<body>
<header>
  <nav>
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="pokedex.html">Tabela</a></li>
      <li><strong>Contato</strong></li>
      <li><a href="equipe.html">Equipe</a></li>
      <li><a href="mensagens.php">Mensagens</a></li>
      <label class="switch">
        <input type="checkbox" id="theme-toggle" checked />
        <span class="slider"></span>
        <span class="clouds_stars"></span>
      </label>
    </ul>
  </nav>
</header>
<div id="popup-container" class="<?= $popup_tipo ?>">
    <?= htmlspecialchars($popup_mensagem) ?>
</div>

<main>
  <h1>Entre em Contato</h1>

  <form id="formContato" method="post" action="">
    <label for="nome">Nome:</label>
    <input type="text" id="nome" name="nome" required />

    <label for="email">E-mail:</label>
    <input
      type="text"
      id="email"
      name="email"
      placeholder="ex: tavin@gmail.com"
      required
    />

    <label for="cpf">CPF:</label>
    <input
      type="text"
      id="cpf"
      name="cpf"
      placeholder="999.999.999-99"
      required
    />

    <label for="assunto">Assunto:</label>
    <input type="text" id="assunto" name="assunto" required />

    <label for="mensagem">Mensagem:</label>
    <textarea id="mensagem" name="mensagem" rows="5" required></textarea>

    <button type="submit">Enviar</button>
  </form>
</main>

<!-- Container para os popups -->
<div id="popup-container"></div>
</body>
</html>
<script src="js/popup.js"></script>