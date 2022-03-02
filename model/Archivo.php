<?php
    require_once("BD.php");
    class Archivo{
        public function __construct(){}

        public static function obtenerRango($nameFile, $inicio, $limit){
            $iso = $nameFile.'_iso';
            $query = "SELECT *,$iso AS iso FROM $nameFile LIMIT $inicio, $limit;";
            $bd = BD::conectar();
            return $bd->consultar($query)->recuperarTodo();
        }
        
        public static function obtenerTodo($nameFile){
            $iso = $nameFile.'_iso';
            $query = "SELECT *,$iso AS iso FROM $nameFile";
            $bd = BD::conectar();
            return $bd->consultar($query)->recuperarTodo();
        }

        public static function seleccion($nameFile, $target, $test){
            $iso = $nameFile.'_iso';
            $query = "SELECT fecha,$test,$iso AS iso FROM $nameFile WHERE $iso='$target'";
            $bd = BD::conectar();
            return $bd->consultar($query)->recuperarTodo();
        }

        public static function isos($nameFile){
            $iso = $nameFile.'_iso';
            $query = "SELECT DISTINCT $iso AS iso FROM $nameFile"; 
            $bd = BD::conectar();
            return $bd->consultar($query)->recuperarTodo();
        }

        public static function historial($nameFile, $iso){
            $isoName = $nameFile.'_iso';
            $query = "SELECT *, $isoName AS iso FROM $nameFile WHERE $isoName = '$iso'";
            $bd = BD::conectar();
            return $bd->consultar($query)->recuperarTodo();
        }

        public static function subir($fichero){
            return $fichero == null;
        }

    }