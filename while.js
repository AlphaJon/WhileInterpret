"use strict";
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
class BaseExpression {
    constructor() {
        this.renderer = null;
    }
    getRenderer() {
        if (!this.renderer) {
            this.renderer = new ExpressionRenderer(this.toString());
        }
        return this.renderer;
    }
}
class MemoryExpression extends BaseExpression {
    constructor(memory, varIndex) {
        super();
        this.memory = memory;
        this.varIndex = varIndex;
    }
    evaluate() {
        return this.memory.getVar(this.varIndex);
    }
    toString() {
        return "V" + this.varIndex;
    }
}
class VarExpression extends BaseExpression {
    constructor(variable, func, ...params) {
        super();
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
    toString() {
        let funcDisplayName = whileFuncNames[this.functionName];
        let params = this.additionalValues.slice(0);
        params.unshift(this.mainVariable);
        let display = params.map(function (value) {
            if (value instanceof VarExpression) {
                return `(${value.toString()})`;
            }
            return value.toString();
        }).join(" ");
        return funcDisplayName + " "
            + display;
    }
}
let globals = {
    get recursiveHighlight() {
        let el = document.getElementById("recursiveHighlight");
        if (!el)
            return false;
        return el.checked;
    },
    set recursiveHighlight(value) {
        let el = document.getElementById("recursiveHighlight");
        if (!el)
            return;
        el.checked = value;
    }
};
class BaseInstruction {
    constructor() {
        this.completed = false;
        this.renderer = null;
    }
    focus(state = true) {
        var _a;
        (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.toggleFocus(state);
    }
    getRenderer() {
        if (!this.renderer) {
            this.renderer = new InstructionRenderer(this.toString());
        }
        return this.renderer;
    }
    resetLoop() {
        var _a;
        this.completed = false;
        (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.toggleFocus(false);
    }
    runAll() {
        while (!this.completed) {
            this.run();
        }
    }
}
class AssignmentInstruction extends BaseInstruction {
    constructor(memory, varNum, value) {
        super();
        this.completed = false;
        this.memory = memory;
        this.varIndex = varNum;
        this.value = value;
    }
    focus(state = true) {
        var _a;
        (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.toggleFocus(state);
    }
    resetLoop() {
        this.completed = false;
    }
    run() {
        var _a;
        this.memory.setVar(this.varIndex, this.value.evaluate());
        (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.toggleFocus(false);
        this.completed = true;
    }
    runAll() {
        this.run();
    }
    toString() {
        return `V${this.varIndex} := ${this.value.toString()}`;
    }
}
class InstructionBlock extends BaseInstruction {
    constructor(instructions) {
        super();
        this.instructions = instructions;
        this.position = 0;
    }
    get completed() {
        return this.position >= this.instructions.length;
    }
    set completed(value) {
    }
    focus(state = true) {
        if (this.renderer) {
            if (globals.recursiveHighlight) {
                this.renderer.toggleFocus(state);
            }
            this.instructions[0].getRenderer().toggleFocus(state);
        }
    }
    getRenderer() {
        if (!this.renderer) {
            this.renderer = new InstructionRenderer(null, "instructionBlock");
            this.instructions.forEach(ins => this.renderer.addChild(ins.getRenderer()));
        }
        return this.renderer;
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
            if (this.renderer) {
                currentIns.getRenderer().toggleFocus(false);
                if (this.position < this.instructions.length) {
                    this.instructions[this.position].focus();
                }
            }
        }
    }
    runAll() {
        while (!this.completed) {
            this.run();
        }
    }
    toString() {
        if (this.instructions.length === 0) {
            return "{}";
        }
        let sourceString = "{\n"
            + this.instructions.map(value => value.toString()).join(";\n")
            + "\n}";
        return sourceString;
    }
}
class ConditionalInstruction extends BaseInstruction {
    constructor(cond) {
        super();
        this.completed = false;
        this.cachedCondition = null;
        this.condition = cond;
    }
    focus(state = true) {
        if (this.renderer) {
            this.condition.getRenderer().toggleFocus(state);
        }
    }
    resetLoop() {
        this.completed = false;
        this.cachedCondition = null;
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
        this.conditionWord = "If";
        this.altConditionWord = "else";
        this.thenInstructions = thenIns;
        this.elseInstructions = elseIns;
    }
    getRenderer() {
        if (!this.renderer) {
            this.renderer = new InstructionRenderer();
            this.renderer.element.prepend(this.conditionWord + " ");
            this.renderer.addChild(this.condition.getRenderer());
            this.renderer.element.append(" then ");
            this.renderer.addChild(this.thenInstructions.getRenderer());
            if (this.elseInstructions) {
                this.renderer.element.append("else");
                this.renderer.addChild(this.elseInstructions.getRenderer());
            }
        }
        return this.renderer;
    }
    resetLoop() {
        var _a;
        super.resetLoop();
        this.thenInstructions.resetLoop();
        (_a = this.elseInstructions) === null || _a === void 0 ? void 0 : _a.resetLoop();
    }
    run() {
        var _a;
        if (this.cachedCondition === null) {
            this.cachedCondition = this.condition.evaluate().toBoolean();
            if (this.renderer) {
                this.condition.getRenderer().toggleFocus(false);
            }
            if (this.renderer && this.cachedCondition) {
                this.thenInstructions.focus();
            }
            else {
                (_a = this.elseInstructions) === null || _a === void 0 ? void 0 : _a.focus();
            }
            if (!this.cachedCondition && !this.elseInstructions) {
                this.completed = true;
            }
            return;
        }
        if (this.cachedCondition) {
            this.thenInstructions.run();
            this.completed = this.thenInstructions.completed;
            if (this.completed) {
                this.thenInstructions.focus(false);
            }
        }
        else {
            if (this.elseInstructions) {
                this.elseInstructions.run();
                this.completed = this.elseInstructions.completed;
                if (this.completed) {
                    this.elseInstructions.focus(false);
                }
            }
            else {
                this.completed = true;
            }
        }
    }
    toString() {
        let str = this.conditionWord + " "
            + this.condition.toString() + " "
            + this.thenInstructions.toString();
        if (this.elseInstructions) {
            str += " " + this.altConditionWord + " "
                + this.elseInstructions.toString();
        }
        return str;
    }
}
class WhileInstruction extends ConditionalInstruction {
    constructor(cond, ins) {
        super(cond);
        this.conditionWord = "While";
        this.whileInstructions = ins;
    }
    getRenderer() {
        if (!this.renderer) {
            this.renderer = new InstructionRenderer();
            this.renderer.element.prepend(this.conditionWord + " ");
            this.renderer.addChild(this.condition.getRenderer());
            this.renderer.addChild(this.whileInstructions.getRenderer());
        }
        return this.renderer;
    }
    resetLoop() {
        super.resetLoop();
        this.whileInstructions.resetLoop();
    }
    run() {
        if (this.cachedCondition === null) {
            this.cachedCondition = this.condition.evaluate().toBoolean();
            if (this.renderer) {
                this.condition.getRenderer().toggleFocus(false);
            }
            if (this.renderer && this.cachedCondition) {
                this.whileInstructions.focus();
            }
            if (!this.cachedCondition) {
                this.completed = true;
            }
            return;
        }
        if (this.cachedCondition) {
            this.whileInstructions.run();
            if (this.whileInstructions.completed) {
                this.resetLoop();
                this.focus();
                this.whileInstructions.focus(false);
            }
        }
        else {
            this.completed = true;
        }
    }
    toString() {
        return this.conditionWord + " "
            + this.condition.toString() + " "
            + this.whileInstructions.toString();
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
            (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.createContainer(this.variables.length);
            this.variables.push(new Atom(null));
        }
        this.variables[index] = value;
        (_b = this.renderer) === null || _b === void 0 ? void 0 : _b.update(index, value.toString());
    }
    setRenderer(element) {
        this.renderer = new MemoryRenderer(element);
    }
}
class Program extends InstructionBlock {
    constructor(memory, block) {
        super(block.instructions);
        this.memory = memory;
    }
    focus() {
        if (this.renderer) {
            this.instructions[0].getRenderer().toggleFocus(true);
        }
    }
    setRenderer(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        this.getRenderer().element.classList.replace("instructionBlock", "program");
        this.getRenderer().addParent(element);
        this.focus();
    }
}
const whileFuncNames = {
    "concat": "cons",
    "equals": "=?",
    "head": "hd",
    "tail": "tl",
    "evaluate": ""
};
class ExpressionRenderer {
    constructor(text) {
        let el = document.createElement("span");
        el.classList.add("expression");
        el.textContent = text;
        this.element = el;
    }
    toggleFocus(state) {
        this.element.classList.toggle("focused", state);
    }
    remove() {
        var _a;
        (_a = this.element.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(this.element);
        delete this.element;
    }
}
class InstructionRenderer {
    constructor(content = null, elClass = "instruction") {
        let el = document.createElement("div");
        el.classList.add(...elClass.split(" "));
        el.textContent = content;
        this.element = el;
    }
    addChild(childInstruction) {
        this.element.appendChild(childInstruction.element);
    }
    addParent(parent) {
        parent.appendChild(this.element);
    }
    toggleFocus(state) {
        this.element.classList.toggle("focused", state);
    }
    remove() {
        var _a;
        (_a = this.element.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(this.element);
        delete this.element;
    }
}
class MemoryRenderer {
    constructor(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        this.element = element;
    }
    createContainer(varIndex) {
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
//# sourceMappingURL=while.js.map