import {createDom} from "./Utils.js";

export class Represent{

    /**
     * 
     * @param {Element} canvas The element on which we will represent the data 
     * @colorsA color palette wiht Alpha
     * @colors color palette wihtout Alpha
     * @state (boolean), if we are draw chart (true) or table (false)
     * @ctx object for chart
     * @myChart chart
     */

    constructor(canvas){
        this.canvas = canvas;
        this.coloresA = ['rgba(204, 0, 0, .4)', 'rgba(224, 102, 102, .4)', 'rgba(246, 178, 107, .4)', 'rgba(230, 145, 56, .4)', 'rgba(241, 194, 50, .4)', 'rgba(255, 217, 102, .4)', 'rgba(147, 196, 125, .4)', 'rgba(106, 168, 79, .4)', 'rgba(69, 129, 142, .4)', 'rgba(118, 165, 175, .4)', 'rgba(111, 168, 220, .4)', 'rgba(61, 133, 198, .4)', 'rgba(103, 78, 167, .4)', 'rgba(142, 124, 195, .4)', 'rgba(194, 123, 160, .4)', 'rgba(166, 77, 121, .4)', 'rgba(102, 0, 0, .4)', 'rgba(120, 63, 4, .4)', 'rgba(127, 96, 0, .4)']
        this.colores = ['rgb(204, 0, 0)', 'rgb(224, 102, 102)', 'rgb(246, 178, 107)', 'rgb(230, 145, 56)', 'rgb(241, 194, 50)', 'rgb(255, 217, 102)', 'rgb(147, 196, 125)', 'rgb(106, 168, 79)', 'rgb(69, 129, 142)', 'rgb(118, 165, 175)', 'rgb(111, 168, 220)', 'rgb(61, 133, 198)', 'rgb(103, 78, 167)', 'rgb(142, 124, 195)', 'rgb(194, 123, 160)', 'rgb(166, 77, 121)', 'rgb(102, 0, 0)', 'rgb(120, 63, 4)', 'rgb(127, 96, 0)'] 
        this.state = false; 
        this.ctx=undefined;
        this.myChart=undefined;
    }

    /* ^-^-^-^-^-^-^-^-^-^-^-^-^- AUX METHODS ^-^-^-^-^-^-^-^-^-^-^-^-^- */

    extractTest(datas){
        let test = [];//object with amout of all diferent test
        for (let i = 0; i < datas.length; i++) {
            datas[i].map((data)=>{
                for (const key in data) {
                    //If it is statistical data and it is not the amount of all
                    if (key.match(/^num.*/) && key!='num_casos') {
                        //Try to enter the data and if it is the first time we do it
                        // we haver to create it before
                        try {
                            test[data["iso"]].push(data[key]);
                        } catch (error) {
                            test[data["iso"]]=[];
                            test[data["iso"]].push(data[key]);
                        }
                    }
                    
                }
            });
        }
        return test;
    }


    /**
     * 
     * @param {string} format acepts (table, bar, doughnut, line or radar)
     * @param {array} data array of object with the data to represent
     */
    represent(format, data){

        switch (format) {
            case "table":
                this.state=false;
                this.canvas.innerHTML="";
                this.tableRepresent(data);
                break;

            case "bar":
            case "doughnut":
            case "line":
            case "radar":
                if (!this.state) {
                    this.canvas.innerHTML="";
                    let objectCanvas = createDom({element:"canvas", atributes:{"id":"myChart"}})
                    this.canvas.appendChild(objectCanvas);
                    this.ctx = objectCanvas.getContext("2d");
                }
                this.chartRepresent(data, format);
                this.state=true
                break;

            case "focus":
                if (!this.state) {
                    this.canvas.innerHTML="";
                    let objectCanvas = createDom({element:"canvas", atributes:{"id":"myChart"}})
                    this.canvas.appendChild(objectCanvas);
                    this.ctx = objectCanvas.getContext("2d");
                }
                this.chartRepresentFocus(data);
                this.state=true
                break;
            default:
                console.log("ERROR EN SWITCH DATA REPRESENT");
                break;
        }

    }


    /**
     * 
     * @param {array} datas  array of object with the data to represent
     * @param {string} type type of chart
     */

    chartRepresent(datas, type){
        let test = {};//object with amout of all diferent test

        datas.map((data)=>{
            for (const key in data) {

                //If it is statistical data and it is not the amount of all
                if (key.match(/^num.*/) && key!='num_casos') {
                    //Try to enter the data and if it is the first time we do it
                    // we haver to create it before
                    try {
                        test[key].push(data[key]);
                    } catch (error) {
                        test[key]=[];
                        test[key].push(data[key]);
                    }
                }
    
            }
        });

        //creating the label with iso cod
        let label = datas.map(dat => dat.iso);
    
        //creating the datasets
        let dataSet = [];
        let aux=0;
        for (const key in test) {
            dataSet.push({
                type: type,
                label: key,
                data: test[key],
                backgroundColor: type=="bar" ? this.coloresA : this.coloresA[aux],
                borderColor: type=="bar" ? this.colores : this.colores[aux],
                borderWidth: 2,
                fill: type=="doughnut" ? true : false,
                radius: 0,
            });
            aux+=3;
        }

        //Extract the dates and drop if it are repeated
        let date = datas.map(data => data["fecha"]);
        date = date.filter((dat, i) => date.indexOf(dat) == i);
        if (date.length>0) date = date.join(' / ') ;
    
        let dataChart = {
            labels:label,
            datasets: dataSet,
        }

        this.totalChar(dataChart, date);
        this.myChart.update();
    }

    chartRepresentFocus(datas){
        let test = [];//object with amout of all diferent test
        for (let i = 0; i < datas.length; i++) {
            datas[i].map((data)=>{
                for (const key in data) {
                    //If it is statistical data and it is not the amount of all
                    if (key.match(/^num.*/) && key!='num_casos') {
                        //Try to enter the data and if it is the first time we do it
                        // we haver to create it before
                        try {
                            test[data["iso"]].push(data[key]);
                        } catch (error) {
                            test[data["iso"]]=[];
                            test[data["iso"]].push(data[key]);
                        }
                    }
                    
                }
            });
        }

        //creating the label with iso cod
        let label;
        for (const key in datas) {
            label = datas[key].map(dat => dat.fecha);
        }

        let aux=0;
        
        //creating the datasets
        let dataSet = [];
        for (const key in test) {
            dataSet.push({
                type: "line",
                label: key,
                data: test[key],
                backgroundColor: this.coloresA[aux],
                borderColor: this.colores[aux],
                fill:false,
                borderWidth: 2,
                radius: 0,
            });
            aux+=3;
        }
    
        let dataChart = {
            labels:label,
            datasets: dataSet,
        }

        let testType;

        for (const key in datas[0][0]) {
            if (key.match(/^num.*/)){
                testType=key;
            }
        }

        this.totalChar(dataChart, "Total: "+testType);
        this.myChart.update();
    }


    /**
     * Assign a chart object ot the property myChart
     * 
     * @param {array} data Array with the diferents registers
     * @param {array} date Array with all data of the diferents registers
     */
    totalChar(data, date='???-??-??'){
        //Clean the canvas before painting
        if (this.myChart) this.myChart.destroy()
        
        this.myChart = new Chart(this.ctx, {
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

    
    /**
     * Represents the data in a format of table
     * 
     * @param {array} data Array with the diferents registers
     */
    tableRepresent(data){
        //Elements of dom scaffolding
        let section, divPadre, p, divBarra, divDatos, color, porcentaje, aux;
        section = createDom({element:"section", clas:["col-7", "overflow-auto", "shadow", "rounded", "bg-white", "border", "border-2", "border-dark", "d-none"]});
        //Test colors
        let colors = ["danger", "warning", "dark", "primary", "secondary"];

        for (const key in data) {
            divPadre = createDom({element:"div", clas:["row", "align-items-center", "dato"]});
            p = createDom({element:"p", clas:["col-2"], content: data[key]["iso"]+"-"+data[key]["fecha"]});
            divBarra = createDom({element:"div", clas:["col-10", "progress"]});
            divDatos = createDom({element:"div", clas:["d-flex", "justify-content-end", "align-items-center"]});
            color=0;
            for (const key2 in data[key]) {
                if (key2.match(/^num.*/)) {
                    if (key2!='num_casos') {
                        //Div of bars
                        //Chack if the percentage is NaN(of 0/0) or no
                        if (data[key][key2]*100/data[key]["num_casos"]) {
                            porcentaje = data[key][key2]*100/data[key]["num_casos"];
                        }
                        else porcentaje = 0;

                        divBarra.appendChild(createDom({element:"div", clas:["progress-bar", "bg-"+colors[color]], content:porcentaje+"%", atributes:{
                            "progressbar":"",
                            "style":"width: "+Math.ceil(porcentaje)+"%"+";"
                        }}));
                        
                        //Part of numeric data
                        aux = key2.split("_");
                        divDatos.appendChild(createDom({
                            element:"button", 
                            clas:["me-3", "px-3", "py-1", "rounded","btn-"+colors[color], "represent"], 
                            atributes:{metadata:data[key]["iso"]+"/"+key2},
                            content:aux[aux.length-1]+" : "+data[key][key2]}))
                        color++;
                    }else{
                        aux = key2.split("_");
                        divDatos.appendChild(createDom({
                            element:"button", 
                            clas:["me-3", "px-3", "py-1", "rounded", "represent"], 
                            atributes:{metadata:data[key]["iso"]+"/"+key2},
                            content:"TOTAL: "+data[key][key2]}))
                    }
                }
            }
            divPadre.appendChild(p);
            divPadre.appendChild(divBarra);
            divPadre.appendChild(divDatos);
            this.canvas.appendChild(divPadre);
            this.canvas.appendChild(document.createElement("hr"));
        }
    
    }
}