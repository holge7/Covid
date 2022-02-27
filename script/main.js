//Importamos la clase ajax
import {Ajax} from "./Ajax.js";

let ajax = new Ajax();


window.onload = ()=>{

    //Variable para ver si vamos a pedir los datos de x en x o los pedimos todos para ordenarlos, etc.
    //false = no todos los datos
    //true = carga todos los datos
    let cargaDatos = false;

    let datos;

    //Esperamos a recuperar todos los datos para poder hacer cosas
    async function recuperarTodosDatos(){
        //Una vez recibido los datos
        datos = await ajax.todo();
        
        //Cortamos el array por los datos que necesitemos
        let datos2 = datos.slice(datoAct, datoAct+cantDatos);
        representarDatos(datos2);
        representarDatos2(datos2)
        //Añadimos la funcionalidad de cambiar de tipo de grafica
        cambioTipoGrafica();
        pintarPaginacion();

    
        document.getElementById("ordenar-mayor").addEventListener("click", (e)=>{
            let foo = buscarRadio(document.getElementsByClassName("form-check-input"));
            datos = ordenar(foo, datos);
            datoAct=0;
            representarDatos(datos.slice(datoAct, datoAct+cantDatos));
            e.stopPropagation();
        }, true);
    
        document.getElementById("ordenar-menor").addEventListener("click", (e)=>{
            let foo = buscarRadio(document.getElementsByClassName("form-check-input"));
            datos = ordenar(foo, datos, false);
            datoAct=0;
            representarDatos(datos.slice(datoAct, datoAct+cantDatos));
            e.stopPropagation();
        }, true);

    }

    // recuperarTodosDatos();

    



    /**
     * 
     * 
     *  ^-^-^-^-^-^-^-^-^-^-^-^-^- @CHARTJS ^-^-^-^-^-^-^-^-^-^-^-^-^- 
     * 
     * 
     */


    let ctx = document.getElementById("myChart").getContext('2d');
    let myChart;
    let chartType="bar";

    //colores -> 19
    let coloresA = ['rgba(204, 0, 0, .4)', 'rgba(224, 102, 102, .4)', 'rgba(246, 178, 107, .4)', 'rgba(230, 145, 56, .4)', 'rgba(241, 194, 50, .4)', 'rgba(255, 217, 102, .4)', 'rgba(147, 196, 125, .4)', 'rgba(106, 168, 79, .4)', 'rgba(69, 129, 142, .4)', 'rgba(118, 165, 175, .4)', 'rgba(111, 168, 220, .4)', 'rgba(61, 133, 198, .4)', 'rgba(103, 78, 167, .4)', 'rgba(142, 124, 195, .4)', 'rgba(194, 123, 160, .4)', 'rgba(166, 77, 121, .4)', 'rgba(102, 0, 0, .4)', 'rgba(120, 63, 4, .4)', 'rgba(127, 96, 0, .4)']
    let colores = ['rgb(204, 0, 0)', 'rgb(224, 102, 102)', 'rgb(246, 178, 107)', 'rgb(230, 145, 56)', 'rgb(241, 194, 50)', 'rgb(255, 217, 102)', 'rgb(147, 196, 125)', 'rgb(106, 168, 79)', 'rgb(69, 129, 142)', 'rgb(118, 165, 175)', 'rgb(111, 168, 220)', 'rgb(61, 133, 198)', 'rgb(103, 78, 167)', 'rgb(142, 124, 195)', 'rgb(194, 123, 160)', 'rgb(166, 77, 121)', 'rgb(102, 0, 0)', 'rgb(120, 63, 4)', 'rgb(127, 96, 0)']
    let coloresI = {
        'num_casos':'rgba(151,187,205)',
        'num_casos_prueba_pcr':'rgba(220,220,220)',
        'num_casos_prueba_test_ac':'rgba(247,70,74)',
        'num_casos_prueba_ag':'rgba(70,191,189)',
        'num_casos_prueba_elisa':'rgba(253,180,92)',
        'num_casos_prueba_desconocida':'rgba(148,159,177)',
    }
    let coloresI2 = {
        'num_casos':'rgba(151,187,205, .3)',
        'num_casos_prueba_pcr':'rgba(220,220,220, .3)',
        'num_casos_prueba_test_ac':'rgba(247,70,74, .3)',
        'num_casos_prueba_ag':'rgba(70,191,189, .3)',
        'num_casos_prueba_elisa':'rgba(253,180,92, .3)',
        'num_casos_prueba_desconocida':'rgba(148,159,177, .3)',

    }
    

    let totalChar = (data, date='???-??-??') =>{
        //Limpiamos el canvas antes de pintar
        if (myChart) {
            myChart.destroy()
        }
        myChart = new Chart(ctx, {
            data: data,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: date,
                    }
                },
                scales: {
                    x: {stacked: true},
                    y: {stacked: true}
                },
                responsive: true
            }
        });
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






    /**
     * 
     * 
     *              PAGINACIÓN Y MUESTRA DE DATOS
     * 
     *  Variables
     * 
     *   @datoAct        Indice de los datos
     * 
     *   @cantDatos      Cantidad de datos que se muestran en cada pagina
     * 
     *   @numPaginas     Cantidad de botones disponibles para pasar pagina
     * 
     *   @paginacionAct  Parte de la paginacion (botones) en la que nos encontramos
     * 
     * 
     *  Funciones
     * 
     *  @representarDatos 
     * 
     */


    let datoAct = 0;
    let cantDatos = 19;
    let numPaginas = 10;
    let paginacionAct = 0;

    let creaElementos = (elemento, clases=null, datos=null, role=null, style=null)=>{
        let e = document.createElement(elemento);

        clases.map((clase)=>e.classList.add(clase))

        if (datos!=null) {
            e.textContent=datos;
        }

        e.setAttribute("role", role);

        e.style.width = style;

        return e;

    }

    let representarDatos2 = (datos) =>{

        let datosLienzo = document.getElementById("datos");

        let section, divPadre, p, divBarra, divDatos, color, porcentaje, aux;

        section = creaElementos("section", ["col-7", "overflow-auto", "shadow", "rounded", "bg-white", "border", "border-2", "border-dark", "d-none"]);
        
        let colors = ["danger", "warning", "dark", "primary", "secondary"]

        for (const key in datos) {
            divPadre = creaElementos("div", ["row", "align-items-center", "dato"]);
            p = creaElementos("p", ["col-2"], datos[key]["ccaa_iso"]+"-"+datos[key]["fecha"]);
            divBarra = creaElementos("div", ["col-10", "progress"]);
            divDatos = creaElementos("div",["d-flex", "justify-content-end", "align-items-center"])
            color=0;
            for (const key2 in datos[key]) {

                if (key2.match(/^num.*/) && key2!='num_casos') {
                    //Div de barras
                    //Vemos si el porcentaje es NaN(de dividir entre 0) o no
                    if (datos[key][key2]*100/datos[key]["num_casos"]) {
                        porcentaje = datos[key][key2]*100/datos[key]["num_casos"];
                    }else{
                        porcentaje = 0;
                    }
                    divBarra.appendChild(creaElementos("div", ["progress-bar", "bg-"+colors[color]], porcentaje+"%", "progressbar",porcentaje+"%"));
                    
                    //Parte de datos numericos
                    aux = key2.split("_");
                    divDatos.appendChild(creaElementos("p", ["me-3", "px-3", "py-1", "rounded","btn-"+colors[color]], aux[aux.length-1]+" : "+datos[key][key2]))
                    color++;
                }
            }
            divPadre.appendChild(p);
            divPadre.appendChild(divBarra);
            divPadre.appendChild(divDatos);
            datosLienzo.appendChild(divPadre);
            datosLienzo.appendChild(document.createElement("hr"));
        }

    }

    let representarDatos = (datos) => {

        let pruebas = {};

        for (let i = 0; i < datos.length; i++) {
            for (const key in datos[i]) {
                //Hago esto pq la nomenclatura de los tipos de prueba es: num..., y si en algun futuro se mete una nueva, 
                //que el script la reconozca automaticamente
                if (key.match(/^num.*/) && key!='num_casos') {
                    //Si en pruebas existe la prueba que vamos a insertar, la insertamos normal, si da error 
                    //quiere decir que no existe, entonces, la creamos y lo insertamos dsp
                    try {
                        pruebas[key].push(datos[i][key]);
                    } catch (error) {
                        pruebas[key]=[];
                        pruebas[key].push(datos[i][key]);
                    }
                }
    
            }
        }

        //creamos el label
        let label = datos.map(dat => dat.ccaa_iso);

        //creamos los datasets
        let dataSet = [];
        for (const key in pruebas) {
            dataSet.push({
                type: chartType,
                label: key,
                data: pruebas[key],
                backgroundColor: coloresA,
                borderColor: colores,
                borderWidth: 1,
                fill:true,
                borderWidth: 5,
            });
        }

        //Extraemos las fechas y eliminamos si hay repetidas
        let date = datos.map(dat => dat["fecha"]);
        date = date.filter((dat, i) => date.indexOf(dat) == i);
        if (date.length>0) date = date.join(' / ') ;

        let data = {
            labels:label,
            datasets: dataSet,
        }
                
        totalChar(data, date);
        myChart.update();

    }


    //Crea un boton de pagina
    let creaBtnPagina = (pagina) =>{
    
        let li = document.createElement("li");
        li.classList.add("page-item", "page");

        let btn = document.createElement("button");
        btn.classList.add("page-link");
        btn.textContent = pagina;

        //Si no se estan cargando todos los datos, se recuperan los datos que hagan falta unicamente
        if (!cargaDatos) {
            btn.addEventListener("click", (e)=>{
                datoAct=pagina*cantDatos;
                recuperarParteDatos();
            })
        }
        //Si ya estan cargados todos los datos, se extrae la parte de la informacion que queremos unicamente
        else{
            btn.addEventListener("click", (e)=>{
                datoAct=pagina*cantDatos;
                representarDatos(datos.slice(datoAct, datoAct+cantDatos));
            })
        }   

        li.appendChild(btn)
        return li;
    }

    //Crea los botones para elegir la pagina
    let pintarPaginacion = () =>{
        let next = document.getElementById("next");
        let paginas = document.getElementById("paginas");

        let borrar = [];
        for (let i = 0; i < paginas.children.length; i++) {
            if (paginas.children[i].classList.contains("page")) {
                borrar.push(paginas.children[i]);
            }
        }
        for (const key in borrar) {
            paginas.removeChild(borrar[key]);
        }

        //Creamos tantos botones como numero de paginas queramos mostrar
        for (let i = datoAct; i < datoAct+numPaginas; i++) {
            let li = creaBtnPagina(i);
            paginas.insertBefore(li, next);
        }
    }

    //Eliminamos los botones anteriores y pintamos los nuevos
    //direccion = true, avanzamos
    //direccion = false, retrocedemos
    let pintarPaginas = (direccion=true) =>{
        let paginas = document.getElementById("paginas");

        //Guardamos todos los los botones que tiene la paginacion en un array y posteriormente los borramos
        let borrar = [];
        for (let i = 0; i < paginas.children.length; i++) {
            if (paginas.children[i].classList.contains("page")) {
                borrar.push(paginas.children[i]);
            }
        }
        for (const key in borrar) {
            paginas.removeChild(borrar[key]);
        }

        if (direccion) {
            paginacionAct += numPaginas;
        }else{
            paginacionAct -= numPaginas;
        }
        datoAct = paginacionAct;

        pintarPaginacion();
    }

    document.getElementById("next").addEventListener("click", ()=>pintarPaginas());

    document.getElementById("previous").addEventListener("click", ()=>{
        //Impedimos que pueda visitar una colección de paginas anterior si se pasa de 0 pq no tenemos paginas -1, -2, -3, etc.
        if (datoAct-numPaginas>=0) pintarPaginas(false);
    });


    let bubble = (datos,orden) => {
        for (let i = 0; i < datos.length; i++) {
            for (let j = 0; j < datos.length; j++) {
                if (orden) {
                    if (datos[i].num_casos > datos[j].num_casos) {
                        //Hacemos swap de las posiciones del array
                        [datos[i],datos[j]] = [datos[j],datos[i]];
                    }
                }else{
                    if (datos[i].num_casos < datos[j].num_casos){
                        //Hacemos swap de las posiciones del array
                        [datos[i],datos[j]] = [datos[j],datos[i]];
                    }
                }
            }
        }
        return datos;
    }

    let sort = (datos,orden) => {
        //Le hacemos un sort
        datos.sort((a, b)=>{
            if (orden) return a[tipoPrueba] < b[tipoPrueba] ? true : false;
            else return a.tipoPrueba > b.tipoPrueba ? true : false;
        });
        return datos;
    }

    let seleccion = (datos,orden) =>{
        let pequenio;
        
        for (let i = 0; i < datos.length; i++) {
            pequenio = i;
            for (let j = i; j < datos.length; j++) {
                if (orden){
                    if (datos[pequenio].num_casos < datos[j].num_casos) pequenio = j;
                }else{                    
                    if (datos[pequenio].num_casos > datos[j].num_casos) pequenio = j;
                }
            }
            //Hacemos un swap de las posiciones del array
            [datos[i],datos[pequenio]] = [datos[pequenio],datos[i]];
        }

        return datos;
    }

    let insercion = (datos,orden) => {
        let temp, j; 
        for (let i =0; i < datos.length; i++) { 
            temp = datos[i]; 
            if (orden) {
                for (j = i - 1; j >= 0 && datos[j] < temp.num_casos; j--) { 
                    datos[j + 1] = datos[j]; 
                } 
            }else{
                for (j = i - 1; j >= 0 && datos[j] > temp.num_casos; j--) { 
                    datos[j + 1] = datos[j]; 
                } 
            }
            datos[j + 1] = temp; 
        }
        return datos;
    }




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
                return bubble(datos, orden);

            case "sort":
                return sort(datos, orden);

            case "seleccion":
                return seleccion(datos, orden);

            case "insercion":
                return insercion(datos, orden);
        
            default:
                break;
        }
    }

    let cambiarModo = () =>{
        cargaDatos = true;
        datoAct = 0;
        recuperarTodosDatos();
    }
    //Cambiamos el modo a cargar todos los datos para ordenar
    document.getElementById("cargarTodo-btn").addEventListener("click", ()=>{
        document.getElementById("cargarTodo").classList.add("d-none");
        document.getElementById("ordenacion").classList.remove("d-none");
        cambiarModo();
    })



    


    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- MAIN ^-^-^-^-^-^-^-^-^-^-^-^-^- */

    async function recuperarParteDatos(){
        //Una vez recibido los datos
        let datos = await ajax.parte(datoAct, cantDatos);
        //representarDatos(datos);
        representarDatos2(datos)


        //Añadimos la funcionalidad de cambiar de tipo de grafica
        cambioTipoGrafica();
    }

    pintarPaginacion();
    recuperarParteDatos();
}