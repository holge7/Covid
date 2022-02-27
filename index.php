<?php

$metodo = $_GET["met"]??"registros";
$modelo = $_GET["mod"]??"archivo";

//Importamos e instanciamos el controlador
$controlador = "{$modelo}Controller";
require_once "controller/{$controlador}.php";

$controlador = new $controlador;

//Si existe el metodo en el controlador lo usamos else throw Exception
if (method_exists($controlador, $metodo)) $controlador->$metodo($_GET["inicio"]??'', $_GET["limit"]??'');
else throw new Exception("El metodo {$metodo} no existe en el controlador");