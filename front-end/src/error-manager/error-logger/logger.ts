type LogLevel = 'error' | 'debug' | 'info' | 'warn'

interface IOption {
  dev?: boolean
  prefix?: string | Function
  forceLevels?: LogLevel[]
}

interface ILogger {
  error: (...args) => void;
  debug: (...args) => void;
  info: (...args) => void;
  warn: (...args) => void;
}

const defaultOptions = {
  prefix: ''
}

const printLogMessage = (logLevel: string, logMessage: string, formattedArguments: any) => {
  if (logLevel === 'warn' || logLevel === 'error') {
    console[logLevel === 'error' ? 'error' : logLevel](logMessage, ...formattedArguments)
  } else {
    console.log(logMessage, ...formattedArguments)
  }
}

class Logger {
  options: IOption
  levels: LogLevel[]

  constructor(options?: IOption) {
    if (options && typeof options === 'object') {
      this.options = { ...defaultOptions, ...options }
    } else {
      this.options = defaultOptions
    }
    this.levels = ['error', 'debug', 'info', 'warn']
  }

  // TODO
  public isValidOptions() {
    return true
  }

  public initLogger() {
    if (typeof console === 'undefined') return

    const logger: ILogger = {} as ILogger

    const { prefix } = this.options
    for (const level of this.levels) {
      let prefixVal = typeof prefix === 'function' ? prefix() : prefix
      prefixVal = prefixVal ? `${prefixVal} :: ` : ''
      const prefixWithLevel = `[${prefixVal}${level}]`.toUpperCase()
      logger[level] = function (...args) {
        printLogMessage(level, prefixWithLevel, args)
      }
    }

    return logger
  }
}

export default Logger
