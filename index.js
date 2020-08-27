"use strict";
class ConditionalInstruction {
    constructor(cond) {
        this.conditionWord = "(?)";
        this.completed = false;
        this.cachedCondition = null;
        this.condition = cond;
    }
    resetLoop() {
        this.completed = false;
        this.cachedCondition = null;
    }
    run() {
        throw new Error("Direct call on abstract class");
    }
    runAll() {
        while (!this.completed) {
            this.run();
        }
    }
}
class Atom {
    constructor(value) {
        this.value = (value === null) ? value : value.trim();
    }
    concat(otherVar) {
        return new Couple(this, otherVar);
    }
    equals(otherVar) {
        if (otherVar instanceof Atom
            && otherVar.value === this.value) {
            return new Couple(new Atom(null), new Atom(null));
        }
        else {
            return new Atom(null);
        }
        ;
    }
    evaluate() {
        return this;
    }
    head() {
        return this;
    }
    tail() {
        return new Atom(null);
    }
    toBoolean() {
        return this.value !== null;
    }
    toString() {
        return this.value === null ? "nil" : '"' + this.value + '"';
    }
}
class Couple {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    concat(otherVar) {
        return new Couple(this, otherVar);
    }
    equals(otherVar) {
        let other = otherVar.evaluate();
        if (other instanceof Couple
            && other.head().equals(this.head())
            && other.tail().equals(this.tail())) {
            return new Couple(new Atom(null), new Atom(null));
        }
        else {
            return new Atom(null);
        }
        ;
    }
    evaluate() {
        return this;
    }
    head() {
        return this.left;
    }
    tail() {
        return this.right;
    }
    toBoolean() {
        return true;
    }
    toString() {
        return `(${this.head().toString()}, ${this.tail().toString()})`;
    }
}
class Expression {
    constructor(variable, func, ...params) {
        this.mainVariable = variable;
        this.functionName = func;
        this.additionalValues = params;
    }
    evaluate() {
        console.log("evaluating (" + this.functionName + ")");
        let variable = this.mainVariable.evaluate();
        let varParams = this.additionalValues;
        let result = varParams.map(value => value.evaluate());
        let x = variable[this.functionName];
        return x.apply(variable, result);
    }
}
class AssignmentInstruction {
    constructor(memory, varNum, value) {
        this.completed = false;
        this.memory = memory;
        this.varIndex = varNum;
        this.value = value;
    }
    resetLoop() {
        this.completed = false;
    }
    run() {
        this.memory.setVar(this.varIndex, this.value.evaluate());
        this.completed = true;
    }
    runAll() {
        this.run();
    }
}
class InstructionBlock {
    constructor(instructions) {
        this.instructions = instructions;
        this.position = 0;
    }
    get completed() {
        return this.position >= this.instructions.length;
    }
    resetLoop() {
        this.instructions.forEach(ins => ins.resetLoop());
        this.position = 0;
    }
    run() {
        if (this.completed) {
            return;
        }
        let currentIns = this.instructions[this.position];
        currentIns.run();
        if (currentIns.completed) {
            this.position++;
        }
    }
    runAll() {
        while (!this.completed) {
            this.run();
        }
    }
}
class IfInstruction extends ConditionalInstruction {
    constructor(cond, thenIns, elseIns = null) {
        super(cond);
        this.thenInstructions = thenIns;
        this.elseInstructions = elseIns;
    }
    resetLoop() {
        var _a;
        super.resetLoop();
        this.thenInstructions.resetLoop();
        (_a = this.elseInstructions) === null || _a === void 0 ? void 0 : _a.resetLoop();
    }
    run() {
        if (this.cachedCondition === null) {
            this.cachedCondition = this.condition.evaluate().toBoolean();
            return;
        }
        if (this.cachedCondition) {
            this.thenInstructions.run();
            this.completed = this.thenInstructions.completed;
        }
        else {
            if (this.elseInstructions) {
                this.elseInstructions.run();
                this.completed = this.elseInstructions.completed;
            }
            else {
                this.completed = true;
            }
        }
    }
}
class WhileInstruction extends ConditionalInstruction {
    constructor(cond, ins) {
        super(cond);
        this.conditionWord = "While";
        this.whileInstructions = ins;
    }
    resetLoop() {
        super.resetLoop();
        this.whileInstructions.resetLoop();
    }
    run() {
        if (this.cachedCondition === null) {
            this.cachedCondition = this.condition.evaluate().toBoolean();
            return;
        }
        if (this.cachedCondition) {
            this.whileInstructions.run();
            if (this.whileInstructions.completed) {
                this.resetLoop();
            }
        }
        else {
            this.completed = true;
        }
    }
}
class Memory {
    constructor() {
        this.renderer = null;
        this.variables = [];
    }
    getVar(index) {
        if (this.variables.length <= index) {
            return new Atom(null);
        }
        console.log(`Get var ${index} with value ${this.variables[index]}`);
        return this.variables[index];
    }
    setVar(index, value) {
        var _a, _b;
        console.log(`Set var ${index} to ${value}`);
        while (index >= this.variables.length) {
            (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.create(this.variables.length);
            this.variables.push(new Atom(null));
        }
        this.variables[index] = value;
        (_b = this.renderer) === null || _b === void 0 ? void 0 : _b.update(index, value.toString());
    }
}
class Program extends InstructionBlock {
    constructor(memory, block) {
        super(block.instructions);
        this.memory = memory;
    }
}
class MemoryRenderer {
    constructor(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        this.element = element;
    }
    create(varIndex) {
        let tmpIndex = "" + varIndex;
        let varContainer = document.createElement("div");
        varContainer.classList.add("varContainer");
        varContainer.setAttribute("while-varIndex", tmpIndex);
        this.element.appendChild(varContainer);
        let varValue = document.createElement("span");
        varValue.textContent = "V" + tmpIndex + " = ";
        varContainer.appendChild(varValue);
        let varContents = document.createElement("span");
        varContents.textContent = "nil";
        varContents.classList.add("varContents");
        varContainer.appendChild(varContents);
    }
    update(index, value) {
        let render = document.querySelector(`.varContainer[while-varIndex="${index}"]`);
        let renderContent = render.getElementsByClassName("varContents")[0];
        renderContent.textContent = value;
    }
}
//# sourceMappingURL=index.js.map