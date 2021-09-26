import sendResult from './send-result.js'
import sendError from './send-error.js'
import kind from './kind.js'
import * as $ from '@prelude/predicate'
import * as Err from '@prelude/err'
import type { Sendable } from './prelude.js'

type WsLike = Sendable & {
  on(event: 'message', cb: (message: string) => void): void
  removeListener(event: 'message', cb: (message: string) => void): void
}

const handle =
  (ws: WsLike, { call, result: result_, error: error_, notification, exception }: {
    call?: (method: string, params: unknown) => Promise<unknown>,
    result?: (id: number, result: unknown) => Promise<void>,
    error?: (id: number, error: { code: Err.Code.t, message: string, severity: Err.Severity.t }) => Promise<void>
    notification?: (method: string, params: unknown) => Promise<void>,
    exception: (err: Error) => unknown
  }): () => void => {
    const handler =
      async (msgString: string) => {
        const msg = typeof msgString === 'string' ?
          JSON.parse(msgString) :
          undefined
        const kind_ = kind(msg)
        switch (kind_) {
          case 'call': {
            if (!call) {
              return
            }
            if (!$.exact({
              jsonrpc: $.eq('2.0'),
              id: $.number,
              method: $.string,
              params: $.defined
            })(msg)) {
              throw Err.error('jsonrpc', 'Invalid call.')
            }
            try {
              const result = await call(msg.method, msg.params)
              await sendResult(ws, msg.id, result)
            } catch (err: unknown) {
              await sendError(ws, msg.id, err)
            }
            break
          }
          case 'result': {
            if (!result_) {
              return
            }
            if (!$.exact({ jsonrpc: $.eq('2.0'), id: $.number, result: $.defined })(msg)) {
              throw Err.error('jsonrpc', 'Invalid result.')
            }
            await result_(msg.id, msg.result)
            break
          }
          case 'error': {
            if (!error_) {
              return
            }
            if (!$.exact({
              jsonrpc: $.eq('2.0'),
              id: $.number,
              error: $.object({
                code: $.unknown,
                severity: $.unknown,
                message: $.string
              })
            })(msg)) {
              throw Err.error('jsonrpc', 'Invalid error.')
            }
            const message = Err.message(msg.error)
            const code = Err.code(msg.error)
            const severity = Err.severity(msg.error)
            await error_(msg.id, { message, code, severity })
            break
          }
          case 'notification': {
            if (!notification) {
              return
            }
            if (!$.exact({
              jsonrpc: $.eq('2.0'),
              method: $.string,
              params: $.defined
            })(msg)) {
              throw Err.error('jsonrpc', 'Invalid notification.')
            }
            await notification(msg.method, msg.params)
            break
          }
          default:
            throw Err.error('jsonrpc', 'Not a jsonrpc message.')
        }
      }
    const handler_ =
      (msgString: string) =>
        handler(msgString).catch(exception)
    ws.on('message', handler_)
    return () => ws.removeListener('message', handler_)
  }

export default handle
