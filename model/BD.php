<?php

    class BD{

        private static ?BD $instancia = null;
        private PDO $conexion;
        private $res;

        private function __construct(){
            $this->conexion = new PDO("mysql:host=localhost;dbname=covitron", "root", "");
        }
        
        private function __clone(){}

        public static function conectar(){
            if (!self::$instancia) self::$instancia = new BD();
            return self::$instancia;
        }

        public function consultar($sql){
            $this->res = $this->conexion->prepare($sql);
            $this->res->execute();
            return $this;
        }

        public function recuperarObjeto($clase = "StdClass"){
            return $this->res->fetchObject($clase);
        }

        public function recuperarTodo(){
            $datos = [];
            while ($registro = $this->recuperarObjeto()){
                array_push($datos, $registro);
            }
            return $datos;
        }


    }