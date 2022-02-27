import {Ajax} from "./Ajax.js";
import {Paginacion} from "./paginacion.js";
import {bubble, sort, seleccion, insercion} from "./Utils.js";
import * as Represent from "./dataRepresent.js";

let ajax = new Ajax();


window.onload = ()=>{

    let nextBtn = document.getElementById("next");
    let prevBtn = document.getElementById("previous");
    let pages = document.getElementById("paginas");
    let paginacion = new Paginacion(nextBtn, prevBtn, pages, recuperarParteDatos);

    let datos;

    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- BUSCAR Y APLICAR METODOS ORDENACION ^-^-^-^-^-^-^-^-^-^-^-^-^- */

    //Por el tipo de prueba que queramos ordenar, por defecto va a ser num_casos
    let tipoPrueba="num_casos";

    let buscarRadio = (radios) =>{
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].id;
            }
        }
    }

    document.getElementById("tipo_prueba").addEventListener("change", (e)=>{
        tipoPrueba = e.target.value;
    });


    //La propiedad orden va a ser si queremos que se ordene de < o de >
    //false = >
    //true = <
    let ordenar = (metodo, datos, orden=true) =>{//si no le pasamos orden, por defecto sera true
        switch (metodo) {
            case "bubble":
                return bubble(datos, tipoPrueba, orden);

            case "sort":
                return sort(datos, tipoPrueba,orden);

            case "seleccion":
                return seleccion(datos, tipoPrueba, orden);

            case "insercion":
                return insercion(datos, tipoPrueba, orden);
        
            default:
                break;
        }
    }



    let cambioTipoGrafica = () =>{
        //Añadimos listeners a los botones de cambiar tipo
        let btns = document.getElementsByClassName("btn-chart");
    
        for (const btn of btns) {
            btn.addEventListener("click", ()=>{
                //Actualizamos el tipo en el chart y lo guardamos en una variable para cuando pasemos
                //de pagina, que siga el mismo tipo de grafica
                myChart.data.datasets[0].type=btn.attributes["data-tipo"].value;
                chartType=btn.attributes["data-tipo"].value;
                myChart.update();
            } )
    
        }
    
    }


    //Cambiamos el modo a cargar todos los datos para ordenar
    document.getElementById("cargarTodo-btn").addEventListener("click", ()=>{
        document.getElementById("cargarTodo").classList.add("d-none");
        document.getElementById("ordenacion").classList.remove("d-none");
        recuperarTodosDatos();
    })



    async function recuperarParteDatos(datoAct, cantDatos){
        //Una vez recibido los datos
        let datos = await ajax.parte(datoAct, cantDatos);
        Represent.representarDatos2(datos);

        //Añadimos la funcionalidad de cambiar de tipo de grafica
        //cambioTipoGrafica();
    }

    let allDataRepresentation = (datoAct, cantDatos) =>{
        Represent.representarDatos2(datos.slice(datoAct, datoAct+cantDatos))
    }

    //Esperamos a recuperar todos los datos para poder hacer cosas
    async function recuperarTodosDatos(){
        //Una vez recibido los datos

        datos = await ajax.todo();
        paginacion.callback=allDataRepresentation;


        document.getElementById("ordenar-mayor").addEventListener("click", (e)=>{
            console.log("estoy ordenando")
            let foo = buscarRadio(document.getElementsByClassName("form-check-input"));
            datos = ordenar(foo, datos);
        });
    
        document.getElementById("ordenar-menor").addEventListener("click", (e)=>{
            let foo = buscarRadio(document.getElementsByClassName("form-check-input"));
            datos = ordenar(foo, datos, false);
        });

    }

    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- MAIN ^-^-^-^-^-^-^-^-^-^-^-^-^- */
    recuperarParteDatos(paginacion.datoAct, paginacion.cantDatos);

}