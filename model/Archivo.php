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
            $query = "SELECT fecha,num_casos, $isoName AS iso FROM $nameFile WHERE $isoName = '$iso'";
            $bd = BD::conectar();
            return $bd->consultar($query)->recuperarTodo();
        }

        public static function borrar($fichero){
            $query = "DROP TABLE $fichero";
            $bd = BD::conectar();
            return $bd->consultar($query);
        }

        public static function subir($fichero){
            
            $bd = BD::conectar();
            
            $data = explode("\n", $fichero);
            
            //Extraigo el nombre de la tabla del fichero
            $tabla = explode("/", $data[0]);
            $tabla = explode(",", $tabla[0])[0];
            $tabla = explode("_", $tabla)[0];

            try {
                //Intentamos crear la tabla
                $sql = "CREATE TABLE `$tabla` (
                    `ccaa_iso` varchar(30) NOT NULL,
                    `fecha` date NOT NULL,
                    `num_casos` int(11) NOT NULL,
                    `num_casos_prueba_pcr` int(11) NOT NULL,
                    `num_casos_prueba_test_ac` int(11) NOT NULL,
                    `num_casos_prueba_ag` int(11) NOT NULL,
                    `num_casos_prueba_elisa` int(11) NOT NULL,
                    `num_casos_prueba_desconocida` int(11) NOT NULL
                    )";

                $bd->consultar($sql);//Creamos la tabla
                //return $sql;

            } catch (\Throwable $th) {}

            //si da error es que la tabla ya esta creada,
                //borramos los datos y ponemos los nuevos
                $sql = "TRUNCATE TABLE $tabla;";
                //return $sql;
                $bd->consultar($sql);
                
                $datos = [];
                for ($i=1; $i < count($data)-1; $i++) { 
                    //Hacemos un array de cada registro
                    $registro = explode(",", $data[$i]);
                    //por cada registro comprobamos si es un numero o no, y dependiendo de ello
                    //le ponemos "" o no
                    for ($j=0; $j < count($registro); $j++) { 
                        if (!is_numeric($registro[$j])) $registro[$j] = "'".$registro[$j]."'";
                    }
                    //Transformamos el array en cadena, separada por ,
                    $registro = implode(",", $registro);
                    array_push($datos, "(".$registro.")");
                }
                $datos = implode(",", $datos);
                
                //Formamos la sentencia sql con los valores que acabamos de obtener
                $sql = "INSERT INTO $tabla VALUES $datos;";
                $bd->consultar($sql);
            

            
        }

    }