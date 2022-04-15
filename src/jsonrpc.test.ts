import * as Jsonrpc from './index.js'

test('kind', () => {
  expect(Jsonrpc.kind(undefined)).toBe(undefined)
  expect(Jsonrpc.kind({ jsonrpc: '2.0', id: 1, method: 'a', params: [] })).toBe('call')
  expect(Jsonrpc.kind({ jsonrpc: '2.0', method: 'a', params: [] })).toBe('notification')
  expect(Jsonrpc.kind({ jsonrpc: '2.0', id: 1, result: null })).toBe('result')
  expect(Jsonrpc.kind({ jsonrpc: '2.0', id: 1, error: { message: 'a' } })).toBe('error')
})
