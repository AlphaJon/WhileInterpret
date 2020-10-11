/**
 * A series of Executables
 * This may contain other InstructionBlocks
 */
class InstructionBlock extends BaseInstruction {
    public instructions: BaseInstruction[];
    public position: number;

    get active(){
        return super.active;
    }

    set active(state: boolean){
        super.active = state;
        //this.instructions[0].active = true;
    }

    get completed(){
        return this.position >= this.instructions.length;
    }

    set completed(state: boolean){
        super.completed = state;
    }

    addRenderer(renderer: InstructionBlockRenderer) {
        super.addRenderer(renderer);
        //TODO?
    }

    constructor(instructions: BaseInstruction[]) {
        super();
        this.instructions = instructions;
        this.position = 0;
    }

    /*focus(state: boolean = true) {
        if (this.renderer) {
            if (globals.recursiveHighlight){
                this.renderer.toggleFocus(state);
            }
            this.instructions[0].getRenderer().toggleFocus(state);
        }
    }*/

    /*getRenderer(): InstructionRenderer {
        if (!this.renderer){
            this.renderer = new InstructionRenderer(null, "instructionBlock");
            //this.renderer.element.prepend("{");
            this.instructions.forEach(ins => 
                this.renderer!.addChild(ins.getRenderer())
            )
            //this.renderer.element.append("}");
        }
        
        return this.renderer;
    }*/

    resetLoop(){
        super.resetLoop();
        this.instructions.forEach(ins => ins.resetLoop());
        this.position = 0;
    }

    run(){
        if (this.completed){
            this.active = false;
            return;
        }
        let currentIns = this.instructions[this.position];
        currentIns.run();
        if (currentIns.completed) {
            this.position++;
            currentIns.active = false;
            this.instructions[this.position].active = true;
            /*if (this.renderer){
                currentIns.getRenderer().toggleFocus(false);
                if (this.position < this.instructions.length){
                    this.instructions[this.position].focus();
                }
            }*/
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