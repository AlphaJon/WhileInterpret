class InstructionRenderer implements BaseRenderer {
    element: HTMLElement;

    constructor(content: string | null = null){
        let el = document.createElement("div");
        el.classList.add("instruction");
        el.textContent = content;
        this.element = el;
    }

    addChild(childInstruction: BaseRenderer){
        this.element.appendChild(childInstruction.element);
    }

    addParent(parent: HTMLElement){
        parent.appendChild(this.element);
    }

    toggleFocus(state: boolean) {
        this.element.classList.toggle("focused", state);
    }

    remove() {
        this.element.parentElement?.removeChild(this.element);
        delete this.element;
    }
}