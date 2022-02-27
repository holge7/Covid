import {createDom} from "./Utils.js";


//colores -> 19
let coloresA = ['rgba(204, 0, 0, .4)', 'rgba(224, 102, 102, .4)', 'rgba(246, 178, 107, .4)', 'rgba(230, 145, 56, .4)', 'rgba(241, 194, 50, .4)', 'rgba(255, 217, 102, .4)', 'rgba(147, 196, 125, .4)', 'rgba(106, 168, 79, .4)', 'rgba(69, 129, 142, .4)', 'rgba(118, 165, 175, .4)', 'rgba(111, 168, 220, .4)', 'rgba(61, 133, 198, .4)', 'rgba(103, 78, 167, .4)', 'rgba(142, 124, 195, .4)', 'rgba(194, 123, 160, .4)', 'rgba(166, 77, 121, .4)', 'rgba(102, 0, 0, .4)', 'rgba(120, 63, 4, .4)', 'rgba(127, 96, 0, .4)']
let colores = ['rgb(204, 0, 0)', 'rgb(224, 102, 102)', 'rgb(246, 178, 107)', 'rgb(230, 145, 56)', 'rgb(241, 194, 50)', 'rgb(255, 217, 102)', 'rgb(147, 196, 125)', 'rgb(106, 168, 79)', 'rgb(69, 129, 142)', 'rgb(118, 165, 175)', 'rgb(111, 168, 220)', 'rgb(61, 133, 198)', 'rgb(103, 78, 167)', 'rgb(142, 124, 195)', 'rgb(194, 123, 160)', 'rgb(166, 77, 121)', 'rgb(102, 0, 0)', 'rgb(120, 63, 4)', 'rgb(127, 96, 0)'] 

let ctx = document.getElementById("myChart").getContext('2d');
let myChart;
let chartType="bar";   

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


let representarDatos2 = (datos) =>{

    let datosLienzo = document.getElementById("datos");
    datosLienzo.innerHTML="";

    let section, divPadre, p, divBarra, divDatos, color, porcentaje, aux;

    section = createDom({element:"section", clas:["col-7", "overflow-auto", "shadow", "rounded", "bg-white", "border", "border-2", "border-dark", "d-none"]})
    
    let colors = ["danger", "warning", "dark", "primary", "secondary"]

    for (const key in datos) {
        divPadre = createDom({element:"div", clas:["row", "align-items-center", "dato"]});
        p = createDom({element:"p", clas:["col-2"], content: datos[key]["ccaa_iso"]+"-"+datos[key]["fecha"]});
        divBarra = createDom({element:"div", clas:["col-10", "progress"]});
        divDatos = createDom({element:"div", clas:["d-flex", "justify-content-end", "align-items-center"]});
        color=0;
        for (const key2 in datos[key]) {

            if (key2.match(/^num.*/)) {
                if (key2!='num_casos') {
                    //Div de barras
                    //Vemos si el porcentaje es NaN(de dividir entre 0) o no
                    if (datos[key][key2]*100/datos[key]["num_casos"]) {
                        porcentaje = datos[key][key2]*100/datos[key]["num_casos"];
                    }else{
                        porcentaje = 0;
                    }
                    divBarra.appendChild(createDom({element:"div", clas:["progress-bar", "bg-"+colors[color]], content:porcentaje+"%", atributes:{
                        "progressbar":"",
                        "style":"width: "+porcentaje+"%"+";"
                    }}));
                    
                    //Parte de datos numericos
                    aux = key2.split("_");
                    divDatos.appendChild(createDom({element:"p", clas:["me-3", "px-3", "py-1", "rounded","btn-"+colors[color]], content:aux[aux.length-1]+" : "+datos[key][key2]}))
                    color++;
                }else{
                    aux = key2.split("_");
                    divDatos.appendChild(createDom({element:"p", clas:["me-3", "px-3", "py-1", "rounded"], content:"TOTAL: "+datos[key][key2]}))
                }
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

export {representarDatos, representarDatos2}