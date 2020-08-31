/// <reference path="./expressionBase.ts"/>

class VarExpression<T extends varFunctionNames<Variable>> extends BaseExpression {
    public mainVariable: Evaluable;
    public functionName: T;
    public additionalValues: Evaluable[]; //Parameters<Variable[T]>;

    constructor(variable: Evaluable, func: T, ...params: Parameters<Variable[T]>){
        super();
        this.mainVariable = variable;
        this.functionName = func;
        this.additionalValues = params;
    }

    evaluate(): Variable {
        console.log("evaluating (" + this.functionName + ")");
        let variable = this.mainVariable.evaluate();
        let varParams = this.additionalValues //as Expression<any>[];
        let result = varParams.map(value => value.evaluate());
        let x = variable[this.functionName];
        //@ts-ignore
        return x.apply(variable, result);
    }

    toString(): string {
        let funcDisplayName = whileFuncNames[this.functionName];
        let params = this.additionalValues.slice(0);
        params.unshift(this.mainVariable);
        let display = params.map(function(value){
            if (value instanceof VarExpression) {
                return `(${value.toString()})`;
            }
            return value.toString();
        }).join(" ");
        return funcDisplayName + " " 
            //+ this.mainVariable.toString() + " " 
            + display;
    }
}

/**
 * Type-checking tests
 * Since the type-checking is done at compile-time,
 * we don't have to write unit tests for those
 */
/*
let at = new Atom("test"); //Atom implements Variable
let c = new Couple(at, at); //Couple implements Variable too

//those should not error
let x1 = new Expression(at, "evaluate");
let x2 = new Expression(at, "concat", c);
let x3 = new Expression(x1, "evaluate");
let x4 = new Expression(x3, "evaluate");

//those should error
//@ts-expect-error
let err1 = new Expression(at, "concat"); //Missing parameter
//@ts-expect-error
let err2 = new Expression(c, "equals", c, at); //Too many params
// */