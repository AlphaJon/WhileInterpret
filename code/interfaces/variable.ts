interface Variable extends Evaluable {
    concat(this: Variable, otherVar: Variable): Couple;
    equals(this: Variable, otherVar: Variable): Variable;
    head(this: Variable): Variable;
    tail(this: Variable): Variable;
    toBoolean(): boolean;
    toString(): string;
}

const whileFuncNames = {
    concat: "cons",
    equals: "=?",
    head: "hd",
    tail: "tl"
} as const;

type varFunctionNames<T> = {
    [K in keyof T]: T[K] extends (...args: infer R) => Variable ?
    K //R extends Variable[] ? K : never
    : never
}[keyof T]


