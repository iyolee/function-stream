import {
  catchWindowError,
  catchRejectedPromise,
  catchResourceError,
  catchVueError
} from './helper';

interface IOptions {
  jsError?: boolean;
  resourceError?: boolean;
  consoleError?: boolean;
  scriptError?: boolean;
  vueError?: boolean;
}

type THandler = Function;

const defaultConfig = {
  jsError: true,
  resourceError: true,
  consoleError: false, // console.error默认不处理
  scriptError: false, // 跨域js错误，默认不处理，因为没有任何信息
  vueError: false,
}

class ErrorCatcher {
  static instance: ErrorCatcher;
  config: IOptions;
  handler: THandler | undefined;

  constructor (options?: IOptions, handler?: THandler) {
    this.config = {
      ...defaultConfig,
      ...(options && typeof options === 'object' ? options : null)
    };
    this.handler = handler;
  }

  static getInstance(options?: IOptions, handler?: THandler) {
    if (!(this.instance instanceof this)) {
      this.instance = new this(options, handler);
    }
    return this.instance;
  }

  public perform() {
    const _window = typeof window !== 'undefined'
    ? window
    : {};
    this.registerError(_window);
  }

  private registerError(_window) {
    const { jsError, resourceError, vueError } = this.config;
    if (jsError) {
      catchWindowError(_window, this.handleError.bind(this));
      catchRejectedPromise(_window, this.handleError.bind(this));
    }
    if (resourceError) {
      catchResourceError(_window, this.handleError.bind(this));
    }
    if (vueError) {
      catchVueError(_window, this.handleError.bind(this));
    }
  }

  private handleError(error: Error | unknown) {
    if (typeof this?.handler !== 'function') {
      console.error('Error Catcher: \n', error);
      return;
    }
    // 如果注入了自定义 handler，则不需要走兜底处理
    try {
      this.handler(() => { throw error });
    } catch (anotherError) {
      console.warn('Error Catcher: Error occurred in customized handler!\n', anotherError);
    }
  }
}

export default ErrorCatcher;
