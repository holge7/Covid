<?php
    require_once("model/archivo.php");

    class archivoController{

        public function __construct(){}

        public function registros(){
            echo json_encode(Archivo::obtenerTodo());
        }
        
        public function obtenerRango($inicio, $limit){
            echo json_encode(Archivo::obtenerRango($inicio, $limit));
        }

        public function seleccion($target, $test){
            echo json_encode(Archivo::seleccion($target, $test));
        }

        public function isos(){
            echo json_encode(Archivo::isos());
        }
    }
