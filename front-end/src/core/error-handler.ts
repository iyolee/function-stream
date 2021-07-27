import ErrorHandler from '../error-manager/error-handler';
import { isError } from 'lodash';

const errorHandler = ErrorHandler.getInstance();

// 条件处理
const errorHandlers = [
  {

    handler: (error) => {
      console.log("🚀 ~ 条件处理1", error)
    }
  }, {
    // 接口错误
    condition: (error) => {
      console.log('condition');
      return true;
    },
    handler(err, event) {
      console.log("🚀 ~ 条件处理2", err);
    }
  }
];

// 兜底处理
const defaultHandler = (err) => {
  if (isError(err)) {
    console.error('🚀 ~ 兜底处理', err);
  }
};

errorHandler.registerErrorHandlers(errorHandlers); // 注册条件处理器
errorHandler.registerDefaultHandler(defaultHandler); // 注册兜底处理器

export { errorHandler };
