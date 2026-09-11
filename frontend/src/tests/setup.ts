import { expect, afterEach, vi, beforeAll } from 'vitest'

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})
