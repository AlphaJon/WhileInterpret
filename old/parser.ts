// class Parser {
//     private program: Program;
//     static readonly instructionDelimiter = /;|(\{|\})/;
//     static readonly conditionals = /if\s+(.*?)\s+ then|else|while/i;

//     constructor(program: Program){
//         this.program = program;
//     }

//     buildInstructions(code: string): Executable[] {
//         let mainBlock = /^\s*\{(.*)\}\s*$/s.exec(code);
//         if (mainBlock === null){
//             throw new Error("Program must begin with '{' and end with '}'");
//         }
//         //1 because we only need what's inside the curly brackets
//         //full list would be in index 0
//         let mainInstructionString = mainBlock[1];
//         let instructionStrings = mainInstructionString.split(Parser.instructionDelimiter);
//         //Remove garbage from the array (empty elements, extra whitespace)
//         instructionStrings = instructionStrings.filter(
//             value => value !== undefined && value.trim() !== ""
//             ).map(value => value.trim());
//         console.log(instructionStrings);
//         let instructions = instructionStrings.map(value => new Instruction(this.program, value));
//         return this.parseBlocks(instructions);
//     }

//     /**
//      * Converts a raw array of `Instructions` into an array
//      * containing properly nested `Instructions` and `InstructionBlocks`
//      * @param instructions the raw instructions to build into blocks
//      */
//     parseBlocks(instructions: Instruction[]): Executable[] {
//         //simply here for type assertion purposes, we don't actually want to duplicate the array
//         let processedInstructions: Executable[] = [];
//         let nestingLevel = 0;
//         let blockStart: number;
//         for (let index = 0; index < instructions.length; index++) {
//             let element: Executable = instructions[index];
//             if (element.source === "{") {
//                 if (nestingLevel === 0){
//                     blockStart = index;
//                 }
//                 nestingLevel++;
//             }
//             if (element.source === "}") {
//                 if (nestingLevel <= 0){
//                     throw new Error("Unexpected }");
//                 }
//                 if (nestingLevel === 1){
//                     //get block without { } to avoid infinite recursion
//                     let fullBlockContents = instructions.slice(blockStart + 1, index);
//                     //recursively process raw Instructions into blocks
//                     let processedBlockContents = this.parseBlocks(fullBlockContents);
//                     let block = new InstructionBlock(this.program, 
//                         processedBlockContents
//                         );
//                     //Setup element to be pushed below
//                     element = block;
//                 }
//                 nestingLevel--;
//             }
//             if (nestingLevel === 0) {
//                 processedInstructions.push(element);
//             }
//         }
//         if (nestingLevel !== 0){
//             throw new Error("Unexpected end of code, `}` expected");
//         }
//         //the input, but processed
//         return processedInstructions;
//     }
// }