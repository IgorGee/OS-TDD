import Disk from './IODevice/Disk'
import Printer from './IODevice/Printer'
import Block from './Block'

export default class System {
  readyQueue = []
  memory = []

  constructor(ramSize, diskQuantity, printerQuantity) {
    this.ramSize = ramSize
    this.disks = [...Array(diskQuantity)].map(() => new Disk)
    this.printers = [...Array(printerQuantity)].map(() => new Printer)
  }

  getBestIndexAndStartByte(proc) {
    const memory = this.memory

    let index
    let start
    let smallestFreeSpace = this.ramSize

    if (memory.length === 0) {
      index = 0
      start = 0
    } else {
      const startSpace = memory[0].firstByte - 0
      const endSpace = this.ramSize - memory[memory.length - 1].lastByte

      if (startSpace < smallestFreeSpace && startSpace >= proc.size) {
        index = 0
        start = 0
        smallestFreeSpace = startSpace
      }
      if (endSpace < smallestFreeSpace && endSpace >= proc.size) {
        index = memory.length
        start = memory[memory.length - 1].lastByte + 1
        smallestFreeSpace = endSpace
      }

      for (let i = 1; i < memory.length; i++) {
        const emptySpace = memory[i].firstByte - memory[i - 1].lastByte
        if (emptySpace < smallestFreeSpace && emptySpace >= proc.size) {
          index = i
          start = memory[i - 1].lastByte + 1
        }
      }
    }

    return { index, start }
  }

  allocateMemory(proc) {
    const memory = this.memory
    const { index, start } = this.getBestIndexAndStartByte(proc)
    const block = new Block(proc, start)
    memory.splice(index, 0, block)
  }

  pushReadyQueue(proc) {
    this.readyQueue.push(proc)
  }

  addProcess(proc) {
    this.allocateMemory(proc)
    this.pushReadyQueue(proc)
  }

  deleteProcess(pid) {
    const memoryIndex = this.memory.findIndex(block => block.pid === pid)
    if (memoryIndex < 0) return

    this.memory.splice(memoryIndex, 1)
    this.readyQueue.shift()
  }
}
