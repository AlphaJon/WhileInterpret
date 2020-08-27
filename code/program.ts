/// <reference path="./instructionBlock.ts"/>

class Program extends InstructionBlock {
    public memory: Memory

    constructor(memory: Memory, block: InstructionBlock){
        super(block.instructions);
        this.memory = memory;
    }
}