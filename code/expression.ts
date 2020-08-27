class Expression<T extends Evaluable, U extends varFunctionNames<Variable>> implements Evaluable {
    public mainVariable: T;
    public functionName: U;
    public additionalValues: Parameters<Variable[U]>;

    constructor(variable: T, func: U, ...params: Parameters<Variable[U]>){
        this.mainVariable = variable;
        this.functionName = func;
        this.additionalValues = params;
    }
    evaluate(): Variable {
        console.log("evaluating (" + this.functionName + ")");
        let variable = this.mainVariable.evaluate();
        let varParams = this.additionalValues as Expression<Evaluable, "evaluate">[];
        let result = varParams.map(value => value.evaluate());
        let x = variable[this.functionName];
        //@ts-ignore
        return x.apply(variable, result);
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