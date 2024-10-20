<?php
// Convertar data recebida no formato ISO

// Defina o fuso horário para o horário local
date_default_timezone_set('America/Sao_Paulo');

function converterDataPTBR($dataRecebida) {
    // Recebe a data no formato ISO: AAAA/MM/DD
    list($ano, $mes, $dia) = explode('-', $dataRecebida);

    // Obtém a hora atual no formato HH:MM:SS
    $hora = date('H:i:s');

    // Combina data e hora no formato desejado
    $dataHoraPTBR = $hora . ' - ' . $dia . '/' . $mes . '/' . $ano;

    return $dataHoraPTBR;
}
?>