/**
 * A series of Executables
 * This may contain other InstructionBlocks
 */
class InstructionBlock implements Executable {
    public instructions: Executable[];
    public position: number;

    get completed(){
        return this.position >= this.instructions.length;
    }

    constructor(
        //condition: Instruction, 
        instructions: Executable[]) {
            //this.condition = condition;
            this.instructions = instructions;
            //this.elseInstructions = null;
            this.position = 0;
    }

    resetLoop(){
        this.instructions.forEach(ins => ins.resetLoop());
        this.position = 0;
    }

    run(){
        if (this.completed){
            return;
        }
        let currentIns = this.instructions[this.position];
        currentIns.run();
        if (currentIns.completed) {
            this.position++;
        }
    }

    runAll(){
        while (!this.completed){
            this.run();
        }
    }

    /*get source(): string {
        let sourceString: string = 
            "{\n"
            + this.instructions.map(value => value.source).join(";\n")
            + "\n}";
        return sourceString;
    }*/
}