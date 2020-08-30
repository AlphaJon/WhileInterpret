abstract class BaseExpression implements Evaluable {
    protected renderer: ExpressionRenderer | null;

    constructor(){
        this.renderer = null;
    }

    getRenderer(): ExpressionRenderer {
        if (!this.renderer){
            this.renderer = new ExpressionRenderer(this.toString());
        }
        return this.renderer;
    }

    abstract evaluate(): Variable
    abstract toString(): string
}