let memory;
let grammar = String.raw`
{ 
    memory = new Memory();
}

//program is an InstructionBlock
program = 
    _ instr:instructionGroup _ { 
        return new Program(memory, instr); 
    }

//returns: InstructionBlock (which is an Executable)
instructionGroup = 
    "{" _ instrs:instruction+ _ "}" { 
        return new InstructionBlock(instrs); 
    }

//returns: Executable
instruction = 
    name:varName _ ":=" _ expr:expression _ (&"{"/&"}"/";") _ { 
        return new AssignmentInstruction(memory, name, expr);
    }
    / "if"i _ cond:expression _ "then"i _ ifins:instruction _ elseins:elsegroup? _ 
    { 
        return new IfInstruction(cond, ifins, elseins);
    }
    / "while"i _ cond:expression _ ins:instruction _ 
    {  
        return new WhileInstruction(cond, ins);
    }
    / gr:instructionGroup _ { return gr; }

elsegroup = "else"i _ elseins:instruction { return elseins }

//returns: Expression
expression = 
    "(" _ expr:expression _ ")" { return expr }
    / varIndex:varName { 
        return {
            evaluate: function(){
                return memory.getVar(varIndex);
            }
        }
    }
    / "cons"i _ exprl:expression _ exprr:expression { 
        return new Expression(
            exprl, "concat", exprr
        );
    }
    / "hd"i _ expr:expression {  
        return new Expression(
            expr, "head"
        )
    }
    / "tl"i _ expr:expression {
        return new Expression(
            expr, "tail"
        )
    }
    / "=?" _ exprl:expression _ exprr:expression { 
        return new Expression(
            exprl, "equals", exprr
        )
    }
    / val:rawValue { return new Atom(val) }

//returns: string
varName "variable name" = "V"varname:[0-9]+ { return +varname.join("") }

//returns: Variable
inputParse = 
    left:variable _ ";" _ right:variable {
        //this one is for no "null" at the end of the chain
        return new Couple(left, right);
    }
    / left:variable _ "," _ right:inputParse { 
        //this one is to include "null" at the end of the chain
        return new Couple(left, right); 
    }
    / val:variable { return new Couple(val, new Atom(null)) }

//returns: Variable    
variable = 
    val:rawValue { return new Atom(val) }
    / "(" _ parse:inputParse _ ")" {
        return parse 
    }

//returns: string | null
rawValue = "\"" valuename:[^\"]+ "\"" { return valuename.join(""); }
    / "nil"i { return null; }
    
_ "whitespace" = 
    $([ \t\n\r])* { return undefined }
`;