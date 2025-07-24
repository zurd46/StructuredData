export class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  info(message: string): void {
    console.log(`[${this.getTimestamp()}] ${message}`);
  }

  error(message: string): void {
    console.error(`[${this.getTimestamp()}] ❌ ${message}`);
  }

  warn(message: string): void {
    console.warn(`[${this.getTimestamp()}] ⚠️  ${message}`);
  }

  success(message: string): void {
    console.log(`[${this.getTimestamp()}] ✅ ${message}`);
  }

  debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(`[${this.getTimestamp()}] 🐛 ${message}`);
    }
  }
}

export const logger = new Logger();
