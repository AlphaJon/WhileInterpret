/// <reference path="./instructionConditional.ts"/>

/**
 * a "while" conditional of a program
 */
class WhileInstruction extends ConditionalInstruction {
    readonly conditionWord = "While";
    private whileInstructions: BaseInstruction;

    constructor(cond: VarExpression, ins: BaseInstruction) {
        super(cond);
        this.whileInstructions = ins;
    }

    /*getRenderer(): InstructionRenderer {
        if (!this.renderer){
            this.renderer = new InstructionRenderer();
            this.renderer.element.prepend(this.conditionWord + " ");
            this.renderer.addChild(this.condition.getRenderer());
            this.renderer.addChild(this.whileInstructions.getRenderer());
        }
        return this.renderer;
    }*/

    resetLoop(){
        super.resetLoop();
        this.whileInstructions.resetLoop();
    }

    run(){
        //Evaluating the condition takes one "run" call
        if (this.cachedCondition === null) {
            this.cachedCondition = this.condition.evaluate().toBoolean();
            if (this.cachedCondition){
                this.active = true;
            } else {
                this.completed = true;
            }
            return;
        }

        if (this.cachedCondition) {
            this.whileInstructions.run();
            //If we are at end of loop
            if (this.whileInstructions.completed){
                this.resetLoop();
                this.active = true;
            }
        } else {
            this.completed = true;
        }
    }

    toString(): string {
        return this.conditionWord + " "
        + this.condition.toString() + " "
        + this.whileInstructions.toString();
    }
}

