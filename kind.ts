const kind =
  (msg: unknown): undefined | 'call' | 'result' | 'error' | 'notification' => {
    if (typeof msg !== 'object' || msg === null) {
      return
    }
    if (msg['jsonrpc'] !== '2.0') {
      return
    }
    const id = typeof msg['id'] !== 'undefined'
    const method = typeof msg['method'] !== 'undefined'
    const params = typeof msg['params'] !== 'undefined'
    const result = typeof msg['result'] !== 'undefined'
    const error = typeof msg['error'] !== 'undefined'
    switch (true) {
      case id && method && params && !result && !error:
        return 'call'
      case id && !method && !params && result && !error:
        return 'result'
      case !id && method && params && !result && !error:
        return 'notification'
      case id && !method && !params && !result && error:
        return 'error'
      default:
        return
    }
  }

export default kind
