class Console {
  registry = [];
  rIndex = 0;
  accumulator = 0;
  visitedInstructions = new Set();
  haltOnLoop = false;
  isFinished = false;
  returnCode = -1; // 0 = OK, 1 = loop

  constructor(registry) {
    this.registry = registry;
  }

  run = () => {
    while (!this.isFinished) {
      this.visitedInstructions.add(this.rIndex);
      const instruction = this.registry[this.rIndex];

      switch (instruction.op) {
        case 'nop':
          this.rIndex++;
          break;
        case 'acc':
          this.accumulator += instruction.arg;
          this.rIndex++;
          break;
        case 'jmp':
          this.rIndex += instruction.arg;
          break;
        default:
          console.log(`Unknown instruction: ${instruction}`);
      }

      if (this.rIndex >= this.registry.length) {
        this.isFinished = true;
        this.returnCode = 0;
      }

      if (this.visitedInstructions.has(this.rIndex) && this.haltOnLoop) {
        this.isFinished = true;
        this.returnCode = 1;
      }
    }

    return this.returnCode;
  };
}

module.exports = {
  Console,
};
