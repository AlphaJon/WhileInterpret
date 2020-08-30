class MemoryRenderer implements BaseRenderer {
    element: HTMLElement;
    
    constructor(element: HTMLElement){
        //Empty previous contents
        while (element.firstChild){
            element.removeChild(element.firstChild);
        }
        this.element = element;
    }

    createContainer(varIndex: number){
        let tmpIndex: string = "" + varIndex;

        let varContainer = document.createElement("div");
        varContainer.classList.add("varContainer");
        varContainer.setAttribute("while-varIndex", tmpIndex);
        this.element.appendChild(varContainer);

        let varValue = document.createElement("span");
        varValue.textContent = "V" + tmpIndex + " = ";
        varContainer.appendChild(varValue);

        let varContents = document.createElement("span");
        varContents.textContent = "nil";
        varContents.classList.add("varContents");
        varContainer.appendChild(varContents);
    }

    update(index: number, value: string){
        let render = document.querySelector(
            `.varContainer[while-varIndex="${index}"]`)!;
        let renderContent = render.getElementsByClassName("varContents")[0];
        renderContent.textContent = value;
    }
}