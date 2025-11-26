<?php
require 'php/db.php';

$erro = false;
$mensagem_enviada = false;

// Verifica se o ID foi passado
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo "<script>alert('ID da mensagem não fornecido.'); window.location='mensagens.php';</script>";
    exit;
}

$id = $_GET['id'];

// Busca os dados atuais da mensagem
$stmt = $pdo->prepare("SELECT * FROM mensagens WHERE id = ?");
$stmt->execute([$id]);
$mensagem = $stmt->fetch();

if (!$mensagem) {
    echo "<script>alert('Mensagem não encontrada.'); window.location='mensagens.php';</script>";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $cpf = $_POST['cpf'];
    $assunto = $_POST['assunto'];
    $mensagem_texto = $_POST['mensagem'];

    $stmt = $pdo->prepare("UPDATE mensagens SET nome=?, email=?, cpf=?, assunto=?, mensagem=? WHERE id=?");
    try {
        $stmt->execute([$nome, $email, $cpf, $assunto, $mensagem_texto, $id]);
        // sucesso
        header("Location: mensagens.php?status=sucesso");
        exit;
    } catch (Exception $e) {
        // erro
        header("Location: mensagens.php?status=erro");
        exit;
    }
}



?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Editar Mensagem</title>
    <link rel="stylesheet" href="css/haunterDex_base.css" />
    <link rel="stylesheet" href="css/contato.css" />
    <link rel="stylesheet" href="css/switch.css" />
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
      <li><a href="contato.php">Contato</a></li>
      <li><a href="equipe.html">Equipe</a></li>
      <li><strong>Mensagens</strong></li>
      <label class="switch">
        <input type="checkbox" id="theme-toggle" checked/>
        <span class="slider"></span>
        <span class="clouds_stars"></span>
      </label>
    </ul>
  </nav>
</header>



<main>
    <h1>Editar Mensagem</h1>

        <div id="popup-container"></div> <!-- <-- adicione isto -->

    <?php if ($erro): ?>
        <p style="color:red; text-align:center;">Erro ao atualizar a mensagem.</p>
    <?php endif; ?>

    <form id="formContato" method="post" action="">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" name="nome" value="<?= htmlspecialchars($mensagem['nome']) ?>" required />

        <label for="email">E-mail:</label>
        <input type="text" id="email" name="email" value="<?= htmlspecialchars($mensagem['email']) ?>" required />

        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" name="cpf" value="<?= htmlspecialchars($mensagem['cpf']) ?>" required />

        <label for="assunto">Assunto:</label>
        <input type="text" id="assunto" name="assunto" value="<?= htmlspecialchars($mensagem['assunto']) ?>" required />

        <label for="mensagem">Mensagem:</label>
        <textarea id="mensagem" name="mensagem" rows="5" required><?= htmlspecialchars($mensagem['mensagem']) ?></textarea>

        <button type="submit">Atualizar</button>
    </form>
</main>
</body>
</html>
