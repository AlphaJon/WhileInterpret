/// <reference path="./instructionConditional.ts"/>

/**
 * a "while" conditional of a program
 */
class WhileInstruction extends ConditionalInstruction {
    readonly conditionWord: string = "While";
    private whileInstructions: Executable;

    constructor(cond: VarExpression<any>, ins: Executable) {
        super(cond);
        this.whileInstructions = ins;
    }

    resetLoop(){
        super.resetLoop();
        this.whileInstructions.resetLoop();
    }

    run(){
        //Evaluating the condition takes one "run" call
        if (this.cachedCondition === null) {
            this.cachedCondition = this.condition.evaluate().toBoolean();
            return;
        }

        if (this.cachedCondition) {
            this.whileInstructions.run();
            //If we are at end of loop
            if (this.whileInstructions.completed){
                this.resetLoop();
            }
        } else {
            this.completed = true;
        }
    }
}

