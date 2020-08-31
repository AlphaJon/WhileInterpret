/**
 * A series of Executables
 * This may contain other InstructionBlocks
 */
class InstructionBlock extends BaseInstruction {
    public instructions: BaseInstruction[];
    public position: number;

    get completed(){
        return this.position >= this.instructions.length;
    }

    set completed(value: boolean){
        //Do nothing
    }

    constructor(instructions: BaseInstruction[]) {
        super();
        this.instructions = instructions;
        this.position = 0;
    }

    focus(state: boolean = true) {
        if (this.renderer) {
            if (globals.recursiveHighlight){
                this.renderer.toggleFocus(state);
            }
            this.instructions[0].getRenderer().toggleFocus(state);
        }
    }

    getRenderer(): InstructionRenderer {
        if (!this.renderer){
            this.renderer = new InstructionRenderer(null, "instructionBlock");
            //this.renderer.element.prepend("{");
            this.instructions.forEach(ins => 
                this.renderer!.addChild(ins.getRenderer())
            )
            //this.renderer.element.append("}");
        }
        
        return this.renderer;
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
            if (this.renderer){
                currentIns.getRenderer().toggleFocus(false);
                if (this.position < this.instructions.length){
                    this.instructions[this.position].focus();
                }
            }
        }
        
    }

    runAll(){
        while (!this.completed){
            this.run();
        }
    }

    toString(): string {
        if (this.instructions.length === 0) {
            return "{}";
        }
        let sourceString: string = 
            "{\n"
            + this.instructions.map(value => value.toString()).join(";\n")
            + "\n}";
        return sourceString;
    }
}