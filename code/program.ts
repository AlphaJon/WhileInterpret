/// <reference path="./instructionBlock.ts"/>

class Program extends InstructionBlock {
    public memory: Memory

    constructor(memory: Memory, block: InstructionBlock){
        super(block.instructions);
        this.memory = memory;
    }

    focus() {
        if (this.renderer) {
            this.instructions[0].getRenderer().toggleFocus(true);
        }
    }

    setRenderer(element: HTMLElement){
        while (element.firstChild){
            element.removeChild(element.firstChild);
        }
        this.getRenderer().addParent(element);
        this.focus();
    }
}