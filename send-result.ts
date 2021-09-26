import type { Sendable } from './prelude.js'
import sendJson from './send-json.js'

const sendResult =
  <T>(ws: Sendable, id: number, result: T extends undefined ? never : T): Promise<void> =>
    sendJson(ws, { jsonrpc: '2.0', id, result: result ?? null })

export default sendResult
