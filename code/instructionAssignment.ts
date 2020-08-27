/**
 * An assignment instruction
 */
class AssignmentInstruction implements Executable {
    public completed = false;
    public varIndex: number;
    public value: Expression<any, any>;
    private memory: Memory;

    constructor(memory: Memory, varNum: number, value: Expression<any, any>){
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