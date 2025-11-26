<?php
require 'php/db.php';

// Buscar todas as mensagens ordenadas pelo ID crescente
$stmt = $pdo->query("SELECT * FROM mensagens ORDER BY id ASC");
$mensagens = $stmt->fetchAll();

// Popup
$popup_mensagem = '';
$popup_tipo = '';

if (isset($_GET['status'])) {
    switch ($_GET['status']) {
        case 'sucesso':
            $popup_mensagem = 'Mensagem atualizada com sucesso!';
            $popup_tipo = 'sucesso';
            break;
        case 'erro':
            $popup_mensagem = 'Erro ao atualizar a mensagem.';
            $popup_tipo = 'erro';
            break;
        case 'excluido':
            $popup_mensagem = 'Mensagem excluída com sucesso!';
            $popup_tipo = 'sucesso';
            break;
        case 'erro_exclusao':
            $popup_mensagem = 'Erro ao excluir a mensagem.';
            $popup_tipo = 'erro';
            break;
    }
}

function mascaraCPF($cpf) {
    $cpf = preg_replace('/\D/', '', $cpf);
    return preg_replace('/(\d{3})(\d{3})(\d{3})(\d{2})/', '$1.$2.$3-$4', $cpf);
}

?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Mensagens Recebidas</title>
    <link rel="stylesheet" href="css/mensagens.css" />
    <link rel="stylesheet" href="css/switch.css" />
    <link rel="stylesheet" href="css/haunterDex_base.css" />
    <link rel="stylesheet" href="css/popup.css">
    <script src="js/themeToggle.js"></script>
    <script src="js/theme.js"></script>
    <style>

    </style>
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
<div id="popup-container" class="<?= $popup_tipo ?>">
    <?= htmlspecialchars($popup_mensagem) ?>
</div>

<main>
    <h1>Mensagens Enviadas</h1>

    <?php if (count($mensagens) > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th>Assunto</th>
                    <th>Mensagem</th>
                    <th>Data</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($mensagens as $m): ?>
                    <tr>
                        <td data-label="ID"><?= $m['id'] ?></td>
                        <td data-label="Nome"><?= htmlspecialchars($m['nome']) ?></td>
                        <td data-label="Email"><?= htmlspecialchars($m['email']) ?></td>
                        <td data-label="CPF"><?= mascaraCPF($m['cpf']) ?></td>
                        <td data-label="Assunto"><?= htmlspecialchars($m['assunto']) ?></td>
                        <td data-label="Mensagem"><?= htmlspecialchars($m['mensagem']) ?></td>
                        <td data-label="Data"><?= date('d/m/Y H:i', strtotime($m['data_envio'])) ?></td>
                        <td data-label="Ações">
                            <!-- Editar -->
                            <a href="update.php?id=<?= $m['id'] ?>" title="Editar">
                                <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1v-7M16.5 3.5l4 4L14 14l-4-4 6.5-6.5z" />
                                </svg>
                            </a>

                            <!-- Deletar -->
                            <a href="php/delete.php?id=<?= $m['id'] ?>" title="Deletar" onclick="return confirm('Tem certeza que deseja deletar esta mensagem?');">
                                <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22m-5-4h-8m-4 0h8" />
                                </svg>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p style="text-align:center; margin-top:20px;">Nenhuma mensagem enviada ainda.</p>
    <?php endif; ?>
</main>
</body>
</html>
<script src="js/popup.js"></script>
