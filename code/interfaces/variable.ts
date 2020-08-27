interface Variable extends Evaluable {
    concat(this: Variable, otherVar: Variable): Couple;
    equals(this: Variable, otherVar: Variable): Variable;
    head(this: Variable): Variable;
    tail(this: Variable): Variable;
    toBoolean(): boolean;
    toString(): string;
}

type varFunctionNames<T> = {
    [K in keyof T]: T[K] extends (...args: any) => Variable ?
    K
    : never
}[keyof T]
