let grammar_original = String.raw`
{ 
    memory = new Memory();
}

/*(; 
    (:= (var 1) (quote nil)) 
    (while (var 0) 
        (; (:= (var 1) (cons (hd (var 0)) (var 1)))
            (:= (var 0) (tl (var 0)))
        )
    )
)

{ V1 := nil;
  While V0 {
    V1 := (cons (hd V0) V1);
    V0 := (tl V0)
  }
}*/

program = 
    _ instr:rawInstruction _ { 
        return new Program(memory, instr); 
    }

//returns: InstructionBlock (which is an Executable)
instructionGroup = 
    "(" _ ";" instr1:instruction _ instr2:instruction "}" { 
        return new InstructionBlock(instrs); 
    }

rawInstruction =
    "(" _ instr:instruction _ ")" {
        return instr;
    }
//returns: Executable
instruction = 
    ":=" _ name:varName _ expr:expression _ { 
        return new AssignmentInstruction(memory, name, expr);
    }
    /*/ "if"i _ cond:expression _ "then"i _ ifins:instruction _ elseins:elsegroup? _ 
    { 
        return new IfInstruction(cond, ifins, elseins);
    }*/
    / "while"i _ cond:expression _ ins:instruction _ 
    {  
        return new WhileInstruction(cond, ins);
    }
    / gr:instructionGroup _ { return gr; }

elsegroup = "else"i _ elseins:instruction { return elseins }

//returns: Evaluable
//an instance of the Expression family of classes
expression = 
    //"(" _ expr:expression _ ")" { return expr }
    varIndex:varName { 
        return new MemoryExpression(memory, varIndex);
    }
    / "quote"i _ val:rawValue {
        return val;
    }
    / "cons"i _ exprl:expression _ exprr:expression { 
        return new VarExpression(
            exprl, "concat", exprr
        );
    }
    / "hd"i _ expr:expression {  
        return new VarExpression(
            expr, "head"
        )
    }
    / "tl"i _ expr:expression {
        return new VarExpression(
            expr, "tail"
        )
    }
    / "=?" _ exprl:expression _ exprr:expression { 
        return new VarExpression(
            exprl, "equals", exprr
        )
    }
    / val:rawValue { return new Atom(val) }

//returns: string
varName "variable name" = "(" _ "var "i varname:[0-9]+ _ ")" { return +varname.join("") }

//returns: string | null
rawValue = valuename:[A-Za-z0-9]+ { return valuename.join(""); }
    / "nil"i { return null; }
    
_ "whitespace" = 
    $([ \t\n\r])* { return undefined }
`;