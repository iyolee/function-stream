import { isPromise } from '../utils/isPromise';
import ErrorHandler from './handler';

type Handler = (error: Error, event: { bubble: boolean }) => void;

const errorHandler = ErrorHandler.getInstance();

export async function handleError(task: Promise<any> | Function, handler?: Handler) {
  const event = { bubble: true };
  try {
    let result = task;
    if (typeof task === 'function') {
      result = task();
    } else if (isPromise(task)) {
      result = await task;
    }
    return result;
  } catch (error) {
    if (handler) {
      try {
        handler.call(this, error, event);
      } catch (anotherError) {
        errorHandler.perform(anotherError);
      }
    }
    if (event.bubble) {
      errorHandler.perform(error);
    }
  }
}
