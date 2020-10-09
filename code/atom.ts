class Atom implements Variable {
    public value: string | null;

    constructor(value: string | null) {
        this.value = (value === null) ? value : value.trim();
    }

    concat(otherVar: Variable): Couple {
        return new Couple(this, otherVar);
    }

    equals(otherVar: Variable): Variable {
        //let other = otherVar.evaluate();
        if (otherVar instanceof Atom 
            && otherVar.value === this.value) {
                return new Couple(new Atom(null), new Atom(null));
            } else {
                return new Atom(null);
            };
    }

    evaluate(): Atom {
        return this;
    }

    head(): Atom {
        return this;
        //return new Atom(null);
    }

    tail(): Atom {
        return new Atom(null);
    }

    toBoolean(): boolean {
        return this.value !== null;
    }

    toString(): string {
        return this.value === null ? "nil" : this.value;
    }
}