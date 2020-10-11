/// <reference path="./instructionBase.ts"/>

/**
 * An assignment instruction
 */
class AssignmentInstruction extends BaseInstruction {
    public varIndex: number;
    public value: VarExpression;
    private memory: Memory;

    constructor(memory: Memory, varNum: number, value: VarExpression){
        super();
        this.memory = memory;
        this.varIndex = varNum;
        this.value = value;
    }

    /*focus(state: boolean = true) {
        this.renderer?.toggleFocus(state);
    }*/

    run(){
        this.memory.setVar(this.varIndex, this.value.evaluate());
        //this.renderer?.toggleFocus(false);
        this.active = false;
        this.completed = true;
    }

    runAll(){
        this.run();
    }

    toString(): string {
        return `V${this.varIndex} := ${this.value.toString()}`;
    }
}