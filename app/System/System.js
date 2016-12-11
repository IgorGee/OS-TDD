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

  allocateMemory(proc) {
    const memory = this.memory
    if (memory.length === 0) memory.push(new Block(proc, 0))
    else {
      const block = new Block(proc, memory[memory.length - 1].lastByte + 1)
      memory.push(block)
    }
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
