<?php
require 'carregaMensagem.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    // Redireciona com status de erro
    header("Location: ../mensagens.php?status=erro_exclusao");
    exit;
}

$id = $_GET['id'];

// Tenta deletar a mensagem
if (deletarMensagem($id)) {
    header("Location: ../mensagens.php?status=excluido"); // sucesso
    exit;
} else {
    header("Location: ../mensagens.php?status=erro_exclusao"); // erro
    exit;
}
?>
