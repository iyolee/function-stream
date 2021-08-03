import ErrorHandler, { handleError } from '../error-manager/error-handler'
import Logger from '../error-manager/error-logger'
import ErrorCatcher from '../error-manager/error-catcher'

const catcher = ErrorCatcher.getInstance({}, handleError)
const handler = ErrorHandler.getInstance()
const logger = new Logger({
  prefix: 'Error Manager'
}).initLogger()

// 条件处理
const errorHandlers = [
  {
    handler: (error) => {
      logger?.info('🚀 ~ 条件处理1', error)
    }
  },
  {
    condition: (error) => {
      return true
    },
    handler(error, event) {
      logger?.info('🚀 ~ 条件处理2', error)
    }
  }
]

// 兜底处理
const defaultHandler = (error) => {
  logger?.info('🚀 ~ 兜底处理', error)
}

handler.registerErrorHandlers(errorHandlers) // 注册条件处理器
handler.registerDefaultHandler(defaultHandler) // 注册兜底处理器

export { handler, logger, catcher }
