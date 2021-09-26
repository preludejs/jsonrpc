import * as Err from '@prelude/err'
import sendJson from './send-json.js'
import type { Sendable } from './prelude.js'

const map =
  (err: unknown) => ({
    code: Err.code(err),
    message: Err.message(err),
    severity: Err.severity(err)
  })

const sendError =
  (ws: Sendable, id: number, err: unknown): Promise<void> =>
    sendJson(ws, { jsonrpc: '2.0', id, error: map(err) })

export default sendError
