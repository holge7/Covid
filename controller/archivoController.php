<?php
    require_once("model/archivo.php");

    class archivoController{

        public function __construct(){}

        public function registros($nameFile){
            echo json_encode(Archivo::obtenerTodo($nameFile));
        }
        
        public function obtenerRango($nameFile, $inicio, $limit){
            echo json_encode(Archivo::obtenerRango($nameFile, $inicio, $limit));
        }

        public function seleccion($nameFile, $target, $test){
            echo json_encode(Archivo::seleccion($nameFile, $target, $test));
        }

        public function isos($nameFile){
            echo json_encode(Archivo::isos($nameFile));
        }
    
        public function historial($nameFile, $iso){
            echo json_encode(Archivo::historial($nameFile, $iso));
        }

        public function subir($fichero){
            echo json_encode(Archivo::subir($fichero));
        }

        public function borrar($fichero){
            echo json_encode(Archivo::borrar($fichero));
        }
    }
