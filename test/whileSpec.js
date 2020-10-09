describe("While", function() {
  let program_parser, input_parser;
  //Reverse
  var sampleCode1 = 
  `{ 
    V1 := nil;
    While V0 {
      V1 := (cons (hd V0) V1);
      V0 := (tl V0)
    }
  }`;
  
  //Concat
  var sampleCode2 = 
  `{
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

  var input1 = `a, b, c, d`;
  var input2 = `(a, b, c, d);(e, f, g)`;
  var output1 = `d, c, b, a`;
  var output2 = `a, b, c, d, e, f, g`

  var variable1 = new Couple(
    new Atom("a"), 
    new Couple(
      new Atom("b"), 
      new Couple(
        new Atom("c"), 
        new Couple(
          new Atom("d"),
          new Atom(null)
        )
      )
    )
  );
  var partialVar2 = new Couple(
    new Atom("e"),
    new Couple(
      new Atom("f"),
      new Couple(
        new Atom("g"),
        new Atom(null)
      )
    )
  );
  var variable2 = new Couple(variable1, partialVar2);

  beforeEach(function() {
    program_parser = peg.generate(grammar_easyread, {
      allowedStartRules: ["program"]
    });
    input_parser = peg.generate(grammar_input, {
      allowedStartRules: ["inputParse"]
    });
  });

  it("should parse inputs properly", function() {
    let parse1 = input_parser.parse(input1, {startRule: "inputParse"});
    console.log(parse1.toString());
    expect(parse1.equals(variable1).toBoolean()).toBeTrue();

    let parse2 = input_parser.parse(input2, {startRule: "inputParse"});
    console.log(parse2.toString());
    expect(parse2.equals(variable2).toBoolean()).toBeTrue();
  });

  describe("program parsing, easyread syntax", function() {
    let parse1, parse2, out1, out2;
    beforeEach(function() {
      parse1 = input_parser.parse(input1, {startRule: "inputParse"});
      parse2 = input_parser.parse(input2, {startRule: "inputParse"});
      out1 = input_parser.parse(output1, {startRule: "inputParse"});
      out2 = input_parser.parse(output2, {startRule: "inputParse"});
    });

    it("should parse and run the reverse program", function() {
      let code1 = program_parser.parse(sampleCode1, {startRule: "program"});
      code1.memory.setVar(0, parse1);
      code1.runAll();
      expect(
        code1.memory
        .getVar(1)
        .equals(out1)
        .toBoolean()
      ).toBeTrue();
    });

    it("should parse and run the concat program", function() {
      let code2 = program_parser.parse(sampleCode2, {startRule: "program"});
      code2.memory.setVar(0, parse2);
      code2.runAll();
      expect(
        code2.memory
        .getVar(1)
        .equals(out2)
        .toBoolean()
      ).toBeTrue();
    });
  });
  

});
