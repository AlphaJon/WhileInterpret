interface Executable {
    /**
     * Indicates if the current instruction is running.
     * When it completes, this becomes `false`
     */
    active: boolean;
    /**
     * Indicates if the current instruction is completed.
     * Looping over an instruction will reset this.
     */
    completed: boolean;
    /**
     * Resets the state of the instruction
     * so that it can be ran again in a loop.
     */
    resetLoop(): void;
    /**
     * Executes a single instruction.
     */
    run(): void;
    /**
     * Executes all remaining instructions
     */
    runAll(): void;
}