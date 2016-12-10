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
    const block = new Block(proc.id, 0, proc.size - 1)
    this.memory.push(block)
  }

  pushReadyQueue(proc) {
    this.readyQueue.push(proc)
  }
}
