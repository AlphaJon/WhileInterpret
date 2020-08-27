/*class TokenParser {
    static parse(code: string) {
        let tokens = this.tokenize(code.trim());
        if (tokens.filter(value => value === "(").length 
            !== tokens.filter(value => value === ")").length){
                throw new Error("Bracket mismatch");
            }
        if (tokens.filter(value => value === "{").length 
            !== tokens.filter(value => value === "}").length){
                throw new Error("Curly bracket mismatch");
            }
        let blockRegex = "\{([^\{\}]*)\}";
        let ifRegex = new RegExp("if\s+"+blockRegex);
        let whileRegex = new RegExp("while\s+"+blockRegex);
    }

    static tokenize(code: string) {
        let tokensRegex = /(V[0-9]+|cons|hd|tl|=\?|:=|;|\(|\)|\{|\}|if|then|else|while)/;

        let instructions = code.split(tokensRegex).map(value => value.trim());
        instructions = instructions.filter(value => value !== "");
        return instructions;
    }

    static buildTree(tokens: string[]): InstructionBlock {
        let root = new InstructionBlock(tokens);
        let changed = true;
        while (changed) {
            changed = false;
            let startIndex = tokens.indexOf("(");
            if (startIndex !== -1){
                changed = true;
                let endIndex = tokens.indexOf(")", startIndex);
                let next = tokens.indexOf("(", startIndex+1);
                while (next !== -1 && next < endIndex){
                    startIndex = next;
                    next = tokens.indexOf("(", startIndex+1);
                }
                let group = tokens.slice(startIndex+1, endIndex-1);
                let beforeGroup = tokens.slice(0, startIndex-1);
                let afterGroup = tokens.slice(endIndex+1);
                //tokens = beforeGroup.push(group).concat(afterGroup);
            }
            
            

        }
        return root;
    }

    static findgroup(tokens: string[]) {}
}*/