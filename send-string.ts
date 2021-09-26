import type { Sendable } from './prelude.js'

const sendString =
  (ws: Sendable, payload: string): Promise<void> =>
    new Promise((resolve, reject) => {
      try {
        ws.send(payload, err => err ? reject(err) : resolve(undefined))
      } catch (err: unknown) {
        reject(err)
      }
    })

export default sendString
