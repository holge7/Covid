<?php

    class Lector{

        private $data;
    
        function __construct($fichero){
            $this->fichero = $fichero;
            $this->bd = BD::conectar();
        }

        function leer(){
            $this->data = file($this->fichero);
            return "Lo he leido biennnn";
            return $this;
        }

        // function introducirEnBD($tabla){
        //     for ($i=1; $i < count($this->data); $i++) { 
        //         //Hacemos un array de cada registro
        //         $registro = explode(",", $this->data[$i]);
        //         //por cada registro comprobamos si es un numero o no, y dependiendo de ello
        //         //le ponemos "" o no
        //         for ($j=0; $j < count($registro); $j++) { 
        //             if (!is_numeric($registro[$j])) $registro[$j] = "'".$registro[$j]."'";
        //         }
        //         //Transformamos el array en cadena, separada por ,
        //         $registro = implode(",", $registro);
        //         //Formamos la sentencia sql con los valores que acabamos de obtener
        //         $sql = "INSERT INTO $tabla VALUES ($registro);";
        //         $this->bd->consultar($sql);
        //     }
        // }


    }
