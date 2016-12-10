import Block from './Block'
import Process from '../Process'

describe('Block', () => {
  it('calculates the lastByte correctly', () => {
    const proc = new Process(300, 3)
    const block = new Block(proc, 432)
    expect(block.lastByte).toEqual(731)
  })
})
