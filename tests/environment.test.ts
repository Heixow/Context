import { describe, expect, it } from 'vitest'

describe('environment', () => {
  it('runs with a DOM', () => {
    expect(typeof document).toBe('object')
  })

  it('resolves the @ alias', async () => {
    const { default: App } = await import('@/App')
    expect(typeof App).toBe('function')
  })
})
