let demos = [{}, {}];
demos[0].input = `a, b, c, d`;
demos[0].code = `{ 
    V1 := nil;
    While V0 {
        V1 := (cons (hd V0) V1);
        V0 := (tl V0)
    }
}`;
demos[1].input = `(a, b, c, d);(e, f, g)`;
demos[1].code = `{
    V1 := (hd V0);
    V2 := (tl V0) ;
    V3 := nil;
    While V1 {
        V3 := (cons (hd V1) V3);
        V1 := (tl V1)
    }
    V1:=V2;
    While V3 {
        V1 := (cons (hd V3) V1);
        V3 := (tl V3)
    }
}`;

function loadDemo(num){
    document.getElementById("v0Input").value = demos[num].input;
    document.getElementById("codeInput").value = demos[num].code;
}

let currentProgram = null;
let parsedCode = null;

let program_parser = peg.generate(grammar_easyread, {
    allowedStartRules: ["program"]
});

let input_parser = peg.generate(grammar_input, {
    allowedStartRules: ["inputParse"]
});

document.getElementById("execute").onclick = function(){
    let errorEl = document.getElementById("parseErrorMessage");
    errorEl.style.display = "none";
    errorEl.textContent = "";
    try {
        let rawV0 = document.getElementById("v0Input").value;
        let parsedV0 = input_parser.parse(rawV0, {startRule: "inputParse"});
        
        let code = document.getElementById("codeInput").value;
        currentProgram = program_parser.parse(code, {startRule: "program"});
        currentProgram.memory.setRenderer(document.getElementById("variables"));
        currentProgram.memory.setVar(0, parsedV0);
        document.getElementById("inputs").style.display = "none";
        document.getElementById("codeDisplay").style.removeProperty("display");
        //document.getElementById("codeOutput").textContent = code;
        currentProgram.setRenderer(document.getElementById("codeOutput"));
    } catch (error) {
        console.log(error);
        errorEl.textContent = error.message;
        errorEl.style.removeProperty("display");
    }
    
}
document.getElementById("step").onclick = function(){
    currentProgram.run();
}

let runInterval = null;
document.getElementById("runAll").onclick = function(){
    if (runInterval !== null){
        clearInterval(runInterval);
    }
    let delay = document.getElementById("runAllDelay").value;
    if (+delay === 0){
        currentProgram.runAll();
    } else {
        runInterval = setInterval(() => {
            currentProgram.run();
            if (currentProgram.completed) {
                clearInterval(runInterval);
            }
        }, +delay * 1000);
    }
    
}
document.getElementById("pause").onclick = function(){
    if (runInterval !== null){
        clearInterval(runInterval);
    }
}
document.getElementById("stop").onclick = function(){
    if (runInterval !== null){
        clearInterval(runInterval);
    }
    document.getElementById("codeDisplay").style.display = "none";
    document.getElementById("inputs").style.removeProperty("display");
}
document.getElementById("demoReverse").onclick = function(){
    loadDemo(0);
}
document.getElementById("demoConcat").onclick = function(){
    loadDemo(1);
}