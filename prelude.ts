export type Sendable = {
  send: (message: string, cb: (error?: Error) => void) => void
}
