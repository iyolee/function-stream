export type HandleFn = (error: Error | unknown, event?: { bubble: boolean }) => void;

type ErrorHandlerItem = {
  condition?: (error: Error | unknown) => boolean,
  handler: HandleFn
}

export type ErrorHandlers = ErrorHandlerItem[];

const defaultHandler = (error: Error | unknown) => {
  if (error instanceof Error) {
    throw Error;
  }
  return error;
};

const errorHandlerId = Symbol();

class ErrorHandler {
  private errorHandlers: ErrorHandlers;
  private defaultHandler: HandleFn;
  static instance: ErrorHandler;

  constructor(id: Symbol) {
    if (id !== errorHandlerId) {
      throw new Error(`Can not create a ErrorHandler instance.`);
    }
    this.errorHandlers = [];
    this.defaultHandler = defaultHandler;
  }

  static getInstance() {
    if (!(this.instance instanceof this)) {
      this.instance = new this(errorHandlerId);
    }
    return this.instance;
  }

  registerErrorHandler(handler: ErrorHandlerItem) {
    this.errorHandlers.push(handler);
  }

  unregisterErrorHandler(handler: ErrorHandlerItem) {
    this.errorHandlers = this.errorHandlers.filter(item => item !== handler);
  }

  registerErrorHandlers(handlers: ErrorHandlers) {
    this.errorHandlers.push(...handlers);
  }

  unregisterErrorHandlers(handlers: ErrorHandlers) {
    this.errorHandlers = this.errorHandlers.filter(item => !handlers.includes(item));
  }

  registerDefaultHandler (handler: HandleFn) {
    if (typeof handler === 'function') {
      this.defaultHandler = handler;
    } else {
      throw new Error(`Error Handler: handler must be a function.`);
    }
  }

  unregisterDefaultHandler () {
    this.defaultHandler = defaultHandler;
  }

  private internalDefaultHandler(error: Error | unknown) {
    try {
      this.defaultHandler(error);
    } catch (defaultHandlerError) {
      console.warn('Error Handler: Error occurred in default handler!\n', defaultHandlerError);
    }
  }

  // TODO 支持异步 handler
  perform(error: Error | unknown) {
    if (error === undefined || error === null) return;

    const event = { bubble: true };
    for (let item of this.errorHandlers) {
      if (!event.bubble) break;
      let canRun = true;
      if (typeof item?.condition === 'function') {
        try {
          canRun = item.condition(error);
        } catch (conditionError) {
          this.internalDefaultHandler(conditionError);
        }
      }
      if (canRun) {
        try {
          item.handler(error, event);
        } catch (conditionHandlerError) {
          this.internalDefaultHandler(conditionHandlerError);
        }
      }
    }
    if (event.bubble) {
      this.internalDefaultHandler(error);
    }
  }
}

export default ErrorHandler;
