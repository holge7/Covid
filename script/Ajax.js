//Marcamos la clase como que puede ser exportada
export class Ajax{
    
    constructor(){
        if (window.XMLHttpRequest) {
            this.peticion = new XMLHttpRequest();
        }else{
            this.peticion = new ActiveXObject();
        }
    };

    realizarPeticion(method, url){
        return new Promise((resolve, reject) => {
            //Si el readyStateChange es 4, activa el load y llama al evento
            this.peticion.addEventListener("load", ()=>{
                //Dependiendo del codigo de error, mostraremos una cosa u otra
                if (this.peticion.status==200) {
                    //console.log("Todo ok 😎");
                    //console.log(JSON.parse(this.peticion.responseText))
                    resolve(JSON.parse(this.peticion.responseText));
                }else{
                    console.log("error en Ajax");
                    reject("Fallido: "+this.peticion.status);
                }
            });
            
            this.peticion.open(method, url);
            this.peticion.send();
        });
    }

    async todo(){
        return await this.realizarPeticion("GET", "index.php?mod=archivo&met=registros");
    }

    async parte(inicio, limit){
        let peti = `index.php?mod=archivo&met=obtenerRango&inicio=${inicio}&limit=${limit}`
        //console.log(peti)
        return await this.realizarPeticion("GET", peti)
    }

}