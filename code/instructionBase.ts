abstract class BaseInstruction implements Executable {
    private _active: boolean = false;
    private _completed: boolean = false;
    protected renderer: InstructionRenderer | null;
    protected renderers: InstructionRenderer[];

    get active(){
        return this._active;
    }

    set active(state: boolean){
        this._active = state;
        this.updateRenderers();
    }

    get completed(){
        return this._completed;
    }

    set completed(state: boolean){
        this._completed = state;
        //this.updateRenderers();
    }

    constructor(){
        this.renderer = null;
        this.renderers = [];
    }

    addRenderer(renderer: InstructionRenderer): void {
        this.renderers.push(renderer);
    }

    /*focus(state: boolean = true) {
        this.renderer?.toggleFocus(state);
    }*/

    /*getRenderer(): InstructionRenderer {
        if (!this.renderer){
            this.renderer = new InstructionRenderer(this.toString());
        }
        return this.renderer;
    }*/

    resetLoop(): void {
        this._active = false;
        this._completed = false;
        this.updateRenderers();
        //this.renderer?.toggleFocus(false);
    }

    abstract run(): void

    runAll(): void {
        while (!this.completed){
            this.run();
        }
    }

    abstract toString(): string;

    updateRenderers() {
        this.renderers.forEach(
            renderer => renderer.update(this)
        );
    }
}