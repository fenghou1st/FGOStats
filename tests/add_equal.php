<?php

$a = [];

$a['b']['c']['d'] += 1;
//$a['b']['c']['d'] = ($a['b']['c']['d'] ?? 0) + 1;

echo json_encode($a, JSON_PRETTY_PRINT) . "\n";
