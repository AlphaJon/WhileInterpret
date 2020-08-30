class ExpressionRenderer implements BaseRenderer {
    element: HTMLElement;

    constructor(text: string){
        let el =  document.createElement("span");
        el.classList.add("expression");
        el.textContent = text;
        this.element = el;
    }

    toggleFocus(state: boolean) {
        this.element.classList.toggle("focused", state);
    }

    remove() {
        this.element.parentElement?.removeChild(this.element);
        delete this.element;
    }
}