/// <reference path="./instructionBase.ts"/>

abstract class ConditionalInstruction extends BaseInstruction {
    abstract conditionWord: string;
    public completed = false;
    protected condition: VarExpression<any>;
    /**
     * We have to avoid computing the condition 
     * after each instuction in the condition body,
     * because that would be incorrect.
     * The condition result is calculated once 
     * after we start running the conditional.
     * It can contain 3 values:
     * 
     * `true` and `false`: The condition has been calculated 
     * and its resulting boolean is respectively `true` or `false`
     * 
     * `null`: The consition isn't calculated yet, 
     * or was reset because of a loop.
     */
    protected cachedCondition: boolean | null = null;

    constructor(cond: VarExpression<any>){
        super();
        this.condition = cond;
    }

    focus(state: boolean = true) {
        if (this.renderer){
            this.condition.getRenderer().toggleFocus(state);
        }
    }

    resetLoop() {
        this.completed = false;
        this.cachedCondition = null; //NOT false
    }

    abstract run(): void;

    runAll(){
        while (!this.completed){
            this.run();
        }
    }
}