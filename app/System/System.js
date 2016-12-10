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
    const block = new Block(proc, 0)
    this.memory.push(block)
  }

  pushReadyQueue(proc) {
    this.readyQueue.push(proc)
  }

  addProcess(proc) {
    this.allocateMemory(proc)
    this.pushReadyQueue(proc)
  }

  deleteProcess(pid) {
    const memoryIndex = this.memory.findIndex(block => block.id === pid)
    this.memory.splice(memoryIndex, 1)

    this.readyQueue.shift()
  }
}
