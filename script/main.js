import {Ajax} from "./Ajax.js";
import {Paginacion} from "./paginacion.js";
import {bubble, sort, seleccion, insercion} from "./Utils.js";
import {Represent} from "./dataRepresent.js";
import {createDom} from "./Utils.js";

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
            addListenersFocusBtns();
        });

    }




    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- BUSCAR Y APLICAR METODOS ORDENACION ^-^-^-^-^-^-^-^-^-^-^-^-^- */

    let showTimeSort = (time) => {
        document.getElementById("tiempo").innerHTML=`${time}ms`;
    }

    //Por el tipo de prueba que queramos ordenar, por defecto va a ser num_casos
    let tipoPrueba="num_casos";

    let buscarRadio = (radios) =>{
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].id;
            }
        }
    }



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

    let addOptionsSelectCompare = async(select) => {
        let isos = await ajax.isos();
        let option;
        isos.map((iso)=>{
            for (const key in iso) {
                option = createDom({element:"option", atributes:{"value":iso[key]}, content:iso[key]});
                select.appendChild(option);
                option.addEventListener("click", async(e)=>{
                    let newData = await ajax.seleccion(e.target.getAttribute("value"), test);
                    datos.push(newData)
                    represent.represent("focus", datos);
                });
            }
        });
    }

    let addOptionsSelectShow = async(select) => {
        let isos = await ajax.isos();
        let option;
        isos.map((iso)=>{
            for (const key in iso) {
                option = createDom({element:"option", atributes:{"value":iso[key]}, content:iso[key]});
                select.appendChild(option);
                option.addEventListener("click", async(e)=>{
                    //Tengo que crear un nuevo metodo ajax, para traerme todos los datos de una iso
                    let newData = await ajax.seleccion(e.target.getAttribute("value"), test);
                    console.log(newData);
                    represent.represent("focus", newData);
                });
            }
        });
    }
    
    let changeLayoutPagination = async() => {
        let pages = document.getElementById("paginas");
        let focus = document.getElementById("focus");
        //Ponemos paginacion
        if (pages.classList.contains("d-none")) {
            pages.classList.remove("d-none");
            focus.classList.add("d-none");
        }
        //Quitamos paginacion
        else{
            pages.classList.add("d-none");
            focus.classList.remove("d-none")
            document.getElementById("focus-off").addEventListener("click", ()=>{
                changeLayoutPagination();
                paginacion.clickSimulation();
            })
            await addOptionsSelectCompare(document.getElementById("comparar"));
        }
    }


    let test;
    function addListenersFocusBtns(){
        let btns = document.querySelectorAll(".represent");
        let target;
        for (let i = 0; i < btns.length; i++) {

            btns[i].addEventListener("click", async (e)=>{
                target = e.target.getAttribute("metadata").split("/");
                test = target[1];
                target = target[0];
                datos = [await ajax.seleccion(target, test)];
                represent.represent("focus", datos);
                changeLayoutPagination();
            });
            
        }
    }


    let addListenersSort2 = () => {
        document.getElementById("ordenar-mayor").addEventListener("click", async (e)=>{
            let foo = buscarRadio(document.getElementsByClassName("form-check-input"));
            datos = await ajax.todo();
            datos = ordenar(foo, datos);
            paginacion.callback=allDataRepresentation;
            paginacion.clickSimulation();
        });
    
        document.getElementById("ordenar-menor").addEventListener("click", async (e)=>{
            let foo = buscarRadio(document.getElementsByClassName("form-check-input"));
            datos = await ajax.todo();
            datos = ordenar(foo, datos, false);
            paginacion.clickSimulation();
        });
    }

    async function recuperarParteDatos(datoAct, cantDatos){
        //Una vez recibido los datos
        let datos = await ajax.parte(datoAct, cantDatos);
        represent.represent(typeRepresentation, datos);
        changeRepresent(datos);
        addListenersFocusBtns();
        addOptionsSelectShow(document.getElementById("mostrar-datos-de-select"));
    }
    
    function allDataRepresentation (datoAct, cantDatos){
        let data = datos.slice(datoAct, datoAct+cantDatos);
        represent.represent(typeRepresentation,datos.slice(datoAct, datoAct+cantDatos))
        changeRepresent(data);
        addListenersFocusBtns();
    }

    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- MAIN ^-^-^-^-^-^-^-^-^-^-^-^-^- */

    document.getElementById("reestablecerDatos").addEventListener("click", ()=>{
        paginacion = new Paginacion(nextBtn, prevBtn, pages, recuperarParteDatos);
        paginacion.clickSimulation();
    });

    document.getElementById("tipo_prueba").addEventListener("change", (e)=>{
        tipoPrueba = e.target.value;
    });


    
    addListenersSort2();
    paginacion.clickSimulation();
    
}