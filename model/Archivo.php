<?php
    require_once("BD.php");
    class Archivo{
        public function __construct(){}

        public static function obtenerRango($inicio, $limit){
            $query = "SELECT * FROM ccaa LIMIT $inicio, $limit;";
            $bd = BD::conectar();
            return $bd->consultar($query)->recuperarTodo("ccaa");

        }
        
        public static function obtenerTodo(){
            $query = "SELECT * FROM ccaa";
            $bd = BD::conectar();
            return $bd->consultar($query)->recuperarTodo("ccaa");
        }
    }