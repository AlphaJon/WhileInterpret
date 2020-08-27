class Memory {
    private variables: Variable[];
    public renderer: MemoryRenderer | null;

    constructor() {
        this.renderer = null;
        this.variables = [];
    }

    getVar(index: number): Variable {
        if (this.variables.length <= index){
            //throw new Error("Variable does not exist");
            return new Atom(null);
        }
        console.log(`Get var ${index} with value ${this.variables[index]}`);
        return this.variables[index];
    }

    setVar(index: number, value: Variable): void {
        console.log(`Set var ${index} to ${value}`);
        while (index >= this.variables.length){
            this.renderer?.create(this.variables.length);
            this.variables.push(new Atom(null));
        }
        this.variables[index] = value;
        
        this.renderer?.update(index, value.toString());
    }
    
}