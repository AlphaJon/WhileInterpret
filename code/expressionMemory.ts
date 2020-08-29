class MemoryExpression implements Evaluable {
    private memory: Memory;
    private varIndex: number

    constructor(memory: Memory, varIndex: number){
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