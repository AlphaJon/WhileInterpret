abstract class BaseInstruction implements Executable {
    public completed: boolean = false;
    protected renderer: InstructionRenderer | null;

    constructor(){
        this.renderer = null;
    }

    focus(state: boolean = true) {
        this.renderer?.toggleFocus(state);
    }

    getRenderer(): InstructionRenderer {
        if (!this.renderer){
            this.renderer = new InstructionRenderer(this.toString());
        }
        return this.renderer;
    }

    resetLoop(): void {
        this.completed = false;
        this.renderer?.toggleFocus(false);
    }

    abstract run(): void

    runAll(): void {
        while (!this.completed){
            this.run();
        }
    }

    abstract toString(): string;
}