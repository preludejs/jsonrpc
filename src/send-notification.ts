import sendJson from './send-json.js'
import type { Sendable } from './prelude.js'

const sendNotification =
  (ws: Sendable, method: string, params: unknown): Promise<void> =>
    sendJson(ws, { jsonrpc: '2.0', method, params: params ?? null })

export default sendNotification
