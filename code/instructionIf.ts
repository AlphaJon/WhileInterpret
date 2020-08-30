/// <reference path="./instructionConditional.ts"/>

/**
 * An "if" conditional of a Program
 */
class IfInstruction extends ConditionalInstruction {
    readonly conditionWord = "If";
    readonly altConditionWord = "else";
    private thenInstructions: BaseInstruction;
    private elseInstructions: BaseInstruction | null;

    constructor(cond: VarExpression<any>, 
        thenIns: BaseInstruction, 
        elseIns: BaseInstruction | null = null) {
            super(cond);
            this.thenInstructions = thenIns;
            this.elseInstructions = elseIns;
    }

    getRenderer(): InstructionRenderer {
        if (!this.renderer){
            this.renderer = new InstructionRenderer();
            this.renderer.element.prepend(this.conditionWord + " ");
            this.renderer.addChild(this.condition.getRenderer());
            this.renderer.addChild(this.thenInstructions.getRenderer());
            if (this.elseInstructions){
                this.renderer.addChild(this.elseInstructions.getRenderer());
            }
        }
        
        return this.renderer;
    }

    resetLoop(){
        super.resetLoop();
        this.thenInstructions.resetLoop();
        this.elseInstructions?.resetLoop();
    }

    run(){
        //Evaluating the condition takes one "run" call
        if (this.cachedCondition === null) {
            this.cachedCondition = this.condition.evaluate().toBoolean();
            if (this.renderer) {
                this.condition.getRenderer().toggleFocus(false);
            }
            if (this.renderer && this.cachedCondition) {
                this.thenInstructions.focus();
            } else {
                this.elseInstructions?.focus();
            }
            if (!this.cachedCondition && !this.elseInstructions){
                this.completed = true;
            }
            return;
        }

        if (this.cachedCondition) {
            this.thenInstructions.run();
            this.completed = this.thenInstructions.completed;
            if (this.completed){
                this.thenInstructions.focus(false);
            }
        } else {
            if (this.elseInstructions){
                this.elseInstructions.run();
                this.completed = this.elseInstructions.completed;
                if (this.completed){
                    this.elseInstructions.focus(false);
                }
            } else {
                this.completed = true;
            }
            
        }
    }

    toString(): string {
        let str = this.conditionWord + " "
        + this.condition.toString() + " "
        + this.thenInstructions.toString();
        if (this.elseInstructions){
            str += " " + this.altConditionWord + " "
            + this.elseInstructions.toString();
        }
        return str;
    }

}