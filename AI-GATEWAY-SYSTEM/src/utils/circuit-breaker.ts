export class CircuitBreaker {
  private failures = 0;
  private success = 0;
  private threshold = 5;
  private isOpen = false;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen) {
      throw new Error('Circuit is open');
    }

    try {
      const result = await fn();

      this.success += 1;
      this.failures = 0;

      return result;
    } catch (error) {
      this.failures += 1;

      if (this.failures >= this.threshold) {
        this.isOpen = true;
      }

      throw error;
    }
  }
}