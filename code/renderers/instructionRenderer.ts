class InstructionRenderer implements BaseRenderer {
    children: BaseRenderer[];
    element: HTMLElement;

    constructor(content: string | null = null, elClass: string = "instruction"){
        let el = document.createElement("div");
        el.classList.add(...elClass.split(" "));
        el.textContent = content;
        this.children = [];
        this.element = el;
    }

    addChild(childInstruction: BaseRenderer){
        this.element.appendChild(childInstruction.element);
    }

    addParent(parent: HTMLElement){
        parent.appendChild(this.element);
    }

    createChild(): InstructionRenderer {
        throw new Error("Not implemented.")
    }

    toggleFocus(state: boolean) {
        this.element.classList.toggle("focused", state);
    }

    update(instruction: BaseInstruction){
        this.toggleFocus(instruction.active);
    }

    remove() {
        this.element.parentElement?.removeChild(this.element);
    }
}