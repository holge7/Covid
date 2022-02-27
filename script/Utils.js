let bubble = (datos,tipoPrueba,orden) => {
    for (let i = 0; i < datos.length; i++) {
        for (let j = 0; j < datos.length; j++) {
            if (orden) {
                if (datos[i].tipoPrueba > datos[j].tipoPrueba) {
                    //Hacemos swap de las posiciones del array
                    [datos[i],datos[j]] = [datos[j],datos[i]];
                }
            }else{
                if (datos[i].tipoPrueba < datos[j].tipoPrueba){
                    //Hacemos swap de las posiciones del array
                    [datos[i],datos[j]] = [datos[j],datos[i]];
                }
            }
        }
    }
    return datos;
}

let sort = (datos, tipoPrueba,orden) => {
    //Le hacemos un sort
    datos.sort((a, b)=>{
        if (orden) return a[tipoPrueba] < b[tipoPrueba] ? true : false;
        else return a.tipoPrueba > b.tipoPrueba ? true : false;
    });
    return datos;
}

let seleccion = (datos, tipoPrueba,orden) =>{
    let pequenio;
    
    for (let i = 0; i < datos.length; i++) {
        pequenio = i;
        for (let j = i; j < datos.length; j++) {
            if (orden){
                if (datos[pequenio].tipoPrueba < datos[j].tipoPrueba) pequenio = j;
            }else{                    
                if (datos[pequenio].tipoPrueba > datos[j].tipoPrueba) pequenio = j;
            }
        }
        //Hacemos un swap de las posiciones del array
        [datos[i],datos[pequenio]] = [datos[pequenio],datos[i]];
    }

    return datos;
}

let insercion = (datos, tipoPrueba,orden) => {
    let temp, j; 
    for (let i =0; i < datos.length; i++) { 
        temp = datos[i]; 
        if (orden) {
            for (j = i - 1; j >= 0 && datos[j] < temp.tipoPrueba; j--) { 
                datos[j + 1] = datos[j]; 
            } 
        }else{
            for (j = i - 1; j >= 0 && datos[j] > temp.tipoPrueba; j--) { 
                datos[j + 1] = datos[j]; 
            } 
        }
        datos[j + 1] = temp; 
    }
    return datos;
}

let createDom = ({element, clas=undefined, atributes=undefined, content=undefined}) => {
    let e = document.createElement(element)
    if (clas) e.classList.add(...clas);
    if (atributes) {
        for (const attribute in atributes) {
            e.setAttribute(attribute, atributes[attribute]);
        }
    }
    if (content) e.textContent+=content;
    return e
}

export {bubble, sort, seleccion, insercion, createDom}