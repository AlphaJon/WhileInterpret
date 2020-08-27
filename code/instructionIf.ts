/// <reference path="./InstructionConditional.ts"/>

/**
 * An "if" conditional of a Program
 */
class IfInstruction extends ConditionalInstruction {
    private thenInstructions: Executable;
    private elseInstructions: Executable | null;

    constructor(cond: Expression<any, any>, 
        thenIns: Executable, 
        elseIns: Executable | null = null) {
            super(cond);
            this.thenInstructions = thenIns;
            this.elseInstructions = elseIns;
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
            return;
        }

        if (this.cachedCondition) {
            this.thenInstructions.run();
            this.completed = this.thenInstructions.completed;
        } else {
            if (this.elseInstructions){
                this.elseInstructions.run();
                this.completed = this.elseInstructions.completed;
            } else {
                this.completed = true;
            }
        }
    }

}