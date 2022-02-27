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

export class Paginacion{

    constructor(nextBtn, previousBtn, paginas, callback){
        this.datoAct = 0;
        this.cantDatos = 19;
        this.numPaginas = 10;
        this.paginacionAct = 0;
        this.nextBtn = nextBtn;
        this.previousBtn = previousBtn;
        this.paginas = paginas;
        this.callback = callback;
        this.cambioPagina();
        this.pintarPaginas();
        this.pintarPaginas(false);
    }

    cambioPagina(){
        this.nextBtn.addEventListener("click", ()=> this.pintarPaginas());
        this.previousBtn.addEventListener("click", ()=> this.pintarPaginas(false));
    }

    creaBtnsPagina(){
        let res = [];

        for (let i = this.datoAct; i < this.datoAct+this.numPaginas; i++) {
            let li = document.createElement("li");
            li.classList.add("page-item", "page");
            
            let btn = document.createElement("button");
            btn.classList.add("page-link");
            btn.textContent = i;
            
            btn.addEventListener("click", ()=>{
                this.datoAct=i*this.cantDatos;
                this.callback(this.datoAct, this.cantDatos)
            });
            
            li.appendChild(btn)
            res.push(li)
        }

        return res;
    }

    pintarPaginas(direccion=true){
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
            this.paginacionAct += this.numPaginas;
        }else{
            this.paginacionAct -= this.numPaginas;
        }
        this.datoAct = this.paginacionAct;

        let res = this.creaBtnsPagina();

        for (let i = 0; i < res.length; i++) {
            this.paginas.insertBefore(res[i], this.nextBtn);
        }

    }

}