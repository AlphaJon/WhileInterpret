/// <reference path="./expressionBase.ts"/>

class MemoryExpression extends BaseExpression {
    private memory: Memory;
    private varIndex: number;

    constructor(memory: Memory, varIndex: number){
        super();
        this.memory = memory;
        this.varIndex = varIndex;
    }

    evaluate(): Variable {
        return this.memory.getVar(this.varIndex);
    }

    toString(): string {
        return "V" + this.varIndex;
    }
}