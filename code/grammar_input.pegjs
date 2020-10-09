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
rawValue = valuename:[A-Za-z0-9]+ { return valuename.join(""); }
    / "nil"i { return null; }
    
_ "whitespace" = 
    $([ \t\n\r])* { return undefined }