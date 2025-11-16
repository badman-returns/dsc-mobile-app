import { isDevelopment } from '../config/environment';

class Logger {
  private enabled: boolean;

  constructor() {
    this.enabled = isDevelopment();
  }

  info(message: string, ...args: any[]) {
    if (this.enabled) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  }

  success(message: string, ...args: any[]) {
    if (this.enabled) {
      console.log(`✅ ${message}`, ...args);
    }
  }

  warning(message: string, ...args: any[]) {
    if (this.enabled) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]) {
    if (this.enabled) {
      console.error(`❌ ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.enabled) {
      console.debug(`🐛 ${message}`, ...args);
    }
  }
}

export default new Logger();
