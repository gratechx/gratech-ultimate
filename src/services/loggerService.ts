import { SystemLog } from '../types';

class LoggerService {
  private logs: SystemLog[] = [];
  private listeners: ((logs: SystemLog[]) => void)[] = [];
  private maxLogs = 1000;
  private isDevelopment = true; 

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private addLog(
    level: 'INFO' | 'WARN' | 'ERROR', 
    message: string, 
    module: string, 
    context?: any, 
    error?: any
  ): void {
    const newLog: SystemLog = {
      id: this.generateId(),
      timestamp: Date.now(),
      level,
      message,
      module,
      context: context ? JSON.stringify(context) : undefined,
      stack: error?.stack,
      userId: this.getCurrentUserId()
    };

    this.logs = [newLog, ...this.logs].slice(0, this.maxLogs);
    
    // Console logging for debugging
    if (this.isDevelopment) {
      const logPrefix = `[${level}] [${module}]`;
      if (level === 'ERROR') {
          console.error(logPrefix, message, context || '', error || '');
      } else if (level === 'WARN') {
          console.warn(logPrefix, message, context || '');
      } else {
          console.log(logPrefix, message, context || '');
      }
    }

    this.notify();
  }

  private getCurrentUserId(): string | undefined {
    try {
      const userData = localStorage.getItem('nexus-user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    } catch (error) {
      return undefined;
    }
  }

  private notify(): void {
    this.listeners.forEach(listener => listener([...this.logs]));
  }

  public subscribe(listener: (logs: SystemLog[]) => void): () => void {
    this.listeners.push(listener);
    listener([...this.logs]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public info(message: string, module: string, context?: any): void {
    this.addLog('INFO', message, module, context);
  }

  public warn(message: string, module: string, context?: any): void {
    this.addLog('WARN', message, module, context);
  }

  public error(message: string, module: string, error?: any, context?: any): void {
    this.addLog('ERROR', message, module, context, error);
  }

  public getLogs(): SystemLog[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.notify();
  }
}

export const logger = new LoggerService();