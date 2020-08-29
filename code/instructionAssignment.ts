/**
 * An assignment instruction
 */
class AssignmentInstruction implements Executable {
    public completed = false;
    public varIndex: number;
    public value: VarExpression<any>;
    private memory: Memory;

    constructor(memory: Memory, varNum: number, value: VarExpression<any>){
        this.memory = memory;
        this.varIndex = varNum;
        this.value = value;
    }

    resetLoop(){
        this.completed = false;
    }

    run(){
        this.memory.setVar(this.varIndex, this.value.evaluate());
        this.completed = true;
    }

    runAll(){
        this.run();
    }
}