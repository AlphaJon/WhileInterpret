class Couple implements Variable {
    private left: Variable;
    private right: Variable;

    constructor(left: Variable, right: Variable) {
        this.left = left;
        this.right = right;
    }
    
    concat(otherVar: Variable): Couple{
        return new Couple(this, otherVar);
    }

    equals(otherVar: Variable){
        let other = otherVar.evaluate();
        if (other instanceof Couple
            && other.head().equals(this.head())
            && other.tail().equals(this.tail())){
                return new Couple(new Atom(null), new Atom(null));
            } else {
                return new Atom(null);
            };
    }

    evaluate(): Couple{
        return this;
    }

    head() {
        return this.left;
    }

    tail() {
        return this.right;
    }

    toBoolean(): true {
        return true;
    }

    toString(): string {
        return `(${this.head().toString()}, ${this.tail().toString()})`;
    }
}