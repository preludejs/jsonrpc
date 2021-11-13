import type { Sendable } from './prelude.js'
import sendString from './send-string.js'

const sendJson =
  (ws: Sendable, payload: unknown): Promise<void> =>
    sendString(ws, JSON.stringify(payload))

export default sendJson
