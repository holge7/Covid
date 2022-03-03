//Marcamos la clase como que puede ser exportada
export class Ajax{
    
    constructor(){
        if (window.XMLHttpRequest) {
            this.peticion = new XMLHttpRequest();
        }else{
            this.peticion = new ActiveXObject();
        }
    };

    realizarPeticion(method, url, dataPost=undefined){
        return new Promise((resolve, reject) => {
            //Si el readyStateChange es 4, activa el load y llama al evento
            this.peticion.addEventListener("load", ()=>{
                //Dependiendo del codigo de error, mostraremos una cosa u otra
                if (this.peticion.status==200) {
                    //console.log("Todo ok 😎");
                    //console.log(JSON.parse(this.peticion.responseText))
                    resolve(JSON.parse(this.peticion.responseText));
                }else{
                    //console.log("error en Ajax");
                    reject("Fallido: "+this.peticion.status);
                }
            });
            
            this.peticion.open(method, url);
            if (dataPost) {
                let formData = new FormData()
                formData.append('fichero', dataPost);
                this.peticion.send(formData);
            }else{
                this.peticion.send();
            }
            
        });
    }

    async todo(nameFile){
        return await this.realizarPeticion("GET", `index.php?mod=archivo&met=registros&param0=${nameFile}`);
    }

    async parte(nameFile, inicio, limit){
        let peti = `index.php?mod=archivo&met=obtenerRango&param0=${nameFile}&param1=${inicio}&param2=${limit}`
        return await this.realizarPeticion("GET", peti)
    }

    async seleccion(nameFile,target, test){
        let peti = `index.php?mod=archivo&met=seleccion&param0=${nameFile}&param1=${target}&param2=${test}`;
        return await this.realizarPeticion("GET", peti);
    }

    async isos(nameFile){
        let peti = `index.php?mod=archivo&met=isos&param0=${nameFile}`;
        return await this.realizarPeticion("GET", peti);
    }

    async historial(nameFile,iso){
        let peti = `index.php?mod=archivo&met=historial&param0=${nameFile}&param1=${iso}`;
        return await this.realizarPeticion("GET", peti);
    }

    async subirFichero(fichero){
        let peti = `index.php?mod=Archivo&met=subir`;
        return await this.realizarPeticion("POST", peti, fichero);
    }

    async borrar(nameFile){
        let peti = `index.php?mod=Archivo&met=borrar&param0=${nameFile}`
        return await this.realizarPeticion("GET", peti);
    }

}