import type { Sendable } from './prelude.js'
import sendJson from './send-json.js'

const sendCall =
  (ws: Sendable, id: number, method: string, params: unknown): Promise<void> =>
    sendJson(ws, { jsonrpc: '2.0', id, method, params: params ?? null })

export default sendCall
