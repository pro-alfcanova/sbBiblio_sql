<?php
// Gerar data e hora no formato PTBR

// Defina o fuso horário para o horário local
date_default_timezone_set('America/Sao_Paulo');

function obterDataHora() {
    // Data no formato pt-BR: DD/MM/AAAA
    $data = date('d/m/Y');
    
    // Obtém a hora atual no formato HH:MM:SS
    $hora = date('H:i:s');
    
    // Combina data e hora no formato desejado
    $horaDataPTBR = $hora . " - " . $data;
    
    return $horaDataPTBR;
}
?>