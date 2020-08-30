/// <reference path="./instructionBase.ts"/>

/**
 * An assignment instruction
 */
class AssignmentInstruction extends BaseInstruction {
    public completed = false;
    public varIndex: number;
    public value: VarExpression<any>;
    private memory: Memory;

    constructor(memory: Memory, varNum: number, value: VarExpression<any>){
        super();
        this.memory = memory;
        this.varIndex = varNum;
        this.value = value;
    }

    focus(state: boolean = true) {
        this.renderer?.toggleFocus(state);
    }

    resetLoop(){
        this.completed = false;
    }

    run(){
        this.memory.setVar(this.varIndex, this.value.evaluate());
        this.renderer?.toggleFocus(false);
        this.completed = true;
    }

    runAll(){
        this.run();
    }

    toString(): string {
        return `V${this.varIndex} := ${this.value.toString()}`;
    }
}