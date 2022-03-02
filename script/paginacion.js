import { createDom } from "./Utils.js";

export class Paginacion{

    /**
     *   Default
     *   @currentData    Index of data
     *   @amoutDataPage  Amount of data displayed on each page
     *   @viewablePages  Amount btns availables for turn page
     *   @offsetPage     Part of the page (buttons) in which we find ourselves
     * 
     *   Param
     *   @param {Element} nextBtn     Next page button 
     *   @param {Element} previousBtn Previoues page button
     *   @param {Element} pages       Container in which the visible pages are painted
     *   @param {Function} callback   Function that we execute when we change page 
     * 
     */

    constructor(nextBtn, previousBtn, pages, callback){
        //Default
        this.currentData = 0;
        this.amoutDataPage = 19;
        this.viewablePages = 10;
        this.offsetPage = 0;
        //Param
        this.nextBtn = nextBtn;
        this.previousBtn = previousBtn;
        this.pages = pages;
        this.callback = callback;

        this.turnPage();
        this.drawViewablePages();
        this.drawViewablePages(false);
    }
    
    /**
     * Add listeners to next and previous page buttons
     */

    turnPage(){
        this.nextBtn.addEventListener("click", ()=> this.drawViewablePages());
        this.previousBtn.addEventListener("click", ()=> this.drawViewablePages(false));
    }

    /**
     * Makes a simulation click on the button 1
     */
    clickSimulation(bool = false){
        if (!bool) {
            this.currentData=0;
            this.offsetPage=0;
        }
        this.callback(this.currentData, this.amoutDataPage);
    }

    /**
     * Create the btns to navigate between the differents pages
     * 
     * @returns {Array} with the differents buttons
     */
    creaBtnsPage(){
        let btns = [];

        for (let i = this.currentData; i < this.currentData+this.viewablePages; i++) {
            let li = createDom({element:"li", clas:["page-item", "page"]});
            let btn = createDom({element:"button", clas:["page-link"], content:i+1});//+1 for it to start in number 1 and not  0
            
            //When we do click in any btn, the current data is actualizate and the callback
            //is ejecute with the new numbers to limit
            btn.addEventListener("click", ()=>{
                this.currentData=i*this.amoutDataPage;
                this.callback(this.currentData, this.amoutDataPage)
            });
            
            li.appendChild(btn)
            btns.push(li)
        }

        return btns;
    }

    /**
     * Draw the visible pages
     * 
     * @param {boolean} direction true  => we are moving forward
     *                            false => we are going backwards
     */
    drawViewablePages(direction=true){

        //Delete the previous page buttons
        let clear = [];
        for (let i = 0; i < this.pages.children.length; i++) {
            if (this.pages.children[i].classList.contains("page")) {
                clear.push(this.pages.children[i]);
            }
        }
        clear.map((e)=>this.pages.removeChild(e));

        //Look in which direction we want to go
        if (direction) this.offsetPage += this.viewablePages;
        else this.offsetPage -= this.viewablePages;
        
        this.currentData = this.offsetPage;

        //We oreder the corresponding btns and paint them
        let btns = this.creaBtnsPage();
        btns.map((btn)=>this.pages.insertBefore(btn, this.nextBtn));

    }

}