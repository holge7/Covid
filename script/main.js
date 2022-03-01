import {Ajax} from "./Ajax.js";
import {Paginacion} from "./paginacion.js";
import {bubble, sort, seleccion, insercion} from "./Utils.js";
import {Represent} from "./dataRepresent.js";

let ajax = new Ajax();


window.onload = ()=>{

    let datos;
    let typeRepresentation = "table";

    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- PAGINATION  ^-^-^-^-^-^-^-^-^-^-^-^-^- */

    let nextBtn = document.getElementById("next");
    let prevBtn = document.getElementById("previous");
    let pages = document.getElementById("paginas");
    let paginacion = new Paginacion(nextBtn, prevBtn, pages, recuperarParteDatos);

    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- REPRESENTATION  ^-^-^-^-^-^-^-^-^-^-^-^-^- */

    let cavas = document.getElementById("lienzo");
    let represent = new Represent(cavas);

    //Btns for change the data represent
    let chartBtns = document.getElementsByClassName("btn-represent-chart");
    let tableBtn = document.getElementsByClassName("btn-represent-table")[0];

    /**
     * Add listeners to bottons for change the representation of themselves
     * @param {Array} data Array with the diferents registers 
     */
    let changeRepresent=(data)=>{
        //Chart
        for (let i = 0; i < chartBtns.length; i++) {
            chartBtns[i].addEventListener("click", (e)=>{
                typeRepresentation = e.target["attributes"]["data-tipo"].value;
                represent.represent(typeRepresentation, data);
            });
        }
        //Table
        tableBtn.addEventListener("click", ()=>{
            typeRepresentation = "table";
            represent.represent(typeRepresentation, data);
        })

    }


    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- BUSCAR Y APLICAR METODOS ORDENACION ^-^-^-^-^-^-^-^-^-^-^-^-^- */

    let showTimeSort = (time) => {
        document.getElementById("tiempo").innerHTML=`${time}ms`;
    }

    //Cambiamos el modo a cargar todos los datos para ordenar
    document.getElementById("cargarTodo-btn").addEventListener("click", ()=>{
        document.getElementById("cargarTodo").classList.add("d-none");
        document.getElementById("ordenacion").classList.remove("d-none");
        recuperarTodosDatos();
    })

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
        let time = performance.now();
        let dataSort;
        switch (metodo) {
            case "bubble":
                dataSort = bubble(datos, tipoPrueba, orden);
                showTimeSort(performance.now()-time)
                return dataSort;

            case "sort":
                dataSort = sort(datos, tipoPrueba,orden);
                showTimeSort(performance.now()-time)

                return dataSort;

            case "seleccion":
                dataSort =  seleccion(datos, tipoPrueba, orden);
                showTimeSort(performance.now()-time)

                return dataSort;

            case "insercion":
                dataSort = insercion(datos, tipoPrueba, orden);
                showTimeSort(performance.now()-time)

                return dataSort;
        
            default:
                break;
        }
    }

    let addListenersSort = () => {
        document.getElementById("ordenar-mayor").addEventListener("click", (e)=>{
            let foo = buscarRadio(document.getElementsByClassName("form-check-input"));
            datos = ordenar(foo, datos);
            paginacion.clickSimulation();
        });
    
        document.getElementById("ordenar-menor").addEventListener("click", (e)=>{
            let foo = buscarRadio(document.getElementsByClassName("form-check-input"));
            datos = ordenar(foo, datos, false);
            paginacion.clickSimulation();
        });
    }

    let prueba=() =>{
        let prueba = document.querySelectorAll(".represent");
        let target, test;
        console.log(prueba)
        for (let i = 0; i < prueba.length; i++) {
            console.log("AAAAAAAAAAAAAA")
            prueba[i].addEventListener("click", async (e)=>{
                target = e.target.getAttribute("metadata").split("/");
                test = target[1];
                target = target[0];
                datos = await ajax.seleccion(target, test);
                console.log(datos)
                paginacion.callback=allDataRepresentation;
            });
            
        }
    }



    async function recuperarParteDatos(datoAct, cantDatos){
        //Una vez recibido los datos
        let datos = await ajax.parte(datoAct, cantDatos);
        represent.represent(typeRepresentation, datos);
        changeRepresent(datos);
        prueba();
        
    }
    
    let allDataRepresentation = (datoAct, cantDatos) =>{
        let data = datos.slice(datoAct, datoAct+cantDatos);
        represent.represent(typeRepresentation,datos.slice(datoAct, datoAct+cantDatos))
        changeRepresent(data);
    }
    
    //Esperamos a recuperar todos los datos para poder hacer cosas
    async function recuperarTodosDatos(){
        datos = await ajax.todo();
        paginacion.callback=allDataRepresentation;
        addListenersSort();
    }

    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- MAIN ^-^-^-^-^-^-^-^-^-^-^-^-^- */
    paginacion.clickSimulation();

}