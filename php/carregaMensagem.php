<?php
require 'db.php';

// Buscar todas as mensagens ordenadas pelo ID crescente
$stmt = $pdo->query("SELECT * FROM mensagens ORDER BY id ASC");
$mensagens = $stmt->fetchAll();

function deletarMensagem($id) {
    global $pdo;

    // Prepara a query para deletar
    $stmt = $pdo->prepare("DELETE FROM mensagens WHERE id = ?");

    try {
        return $stmt->execute([$id]); // retorna true se deletou, false se falhou
    } catch (Exception $e) {
        return false;
    }
}

?>