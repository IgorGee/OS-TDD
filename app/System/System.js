import Disk from './IODevice/Disk'
import Printer from './IODevice/Printer'
import Block from './Block'
import Process from './Process'

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

    if (smallestFreeSpace >= proc.size) {
      if (memory.length === 0) {
        index = 0
        start = 0
      } else {
        const startSpace = memory[0].firstByte - 0
        const endSpace = this.ramSize - memory[memory.length - 1].lastByte - 1

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
          const emptySpace = memory[i].firstByte - memory[i - 1].lastByte - 1
          if (emptySpace < smallestFreeSpace && emptySpace >= proc.size) {
            index = i
            start = memory[i - 1].lastByte + 1
          }
        }

        // No room at all, we never found the chance to make it smaller
        if (smallestFreeSpace === this.ramSize) {
          index = undefined
          start = undefined
        }
      }
    }

    return { index, start }
  }

  allocateMemory(proc) {
    const memory = this.memory
    const { index, start } = this.getBestIndexAndStartByte(proc)
    if (index === undefined) return false

    const block = new Block(proc, start)
    memory.splice(index, 0, block)
    return true
  }

  pushReadyQueue(proc) {
    let added = false
    if (this.readyQueue.length === 0) {
      this.readyQueue.push(proc)
      added = true
      return
    }
    for (let i = 0; i < this.readyQueue.length; i++) {
      if (proc.priority > this.readyQueue[i].priority) {
        this.readyQueue.splice(i, 0, proc)
        added = true
        return
      }
    }
    if (!added) this.readyQueue.push(proc)
  }

  addProcess(proc) {
    if (!this.allocateMemory(proc)) {
      Process.idCount -= 1
      return false
    }
    this.pushReadyQueue(proc)
    return true
  }

  deleteProcess() {
    const proc = this.readyQueue.shift()

    const memoryIndex = this.memory.findIndex(block => block.pid === proc.id)
    if (memoryIndex < 0) return

    this.memory.splice(memoryIndex, 1)
  }

  print(printerNumber, filename) {
    if (this.readyQueue.length === 0) return false
    const proc = this.readyQueue.shift()
    proc.ioFileName = filename
    this.printers[printerNumber - 1].add(proc)
    return true
  }

  finishPrint(printerNumber) {
    if (this.printers[printerNumber - 1].queue.length === 0) return false
    const proc = this.printers[printerNumber - 1].remove(proc)
    this.pushReadyQueue(proc)
    return true
  }

  diskIO(diskNumber, filename) {
    if (this.readyQueue.length === 0) return false
    const proc = this.readyQueue.shift()
    proc.ioFileName = filename
    this.disks[diskNumber - 1].add(proc)
    return true
  }

  finishDiskIO(diskNumber) {
    if (this.disks[diskNumber - 1].queue.length === 0) return false
    const proc = this.disks[diskNumber - 1].remove(proc)
    this.pushReadyQueue(proc)
    return true
  }

  prettyPrintReadyQueue() {
    const queue = this.readyQueue

    if (queue.length > 0) {
      console.log(`CPU: P${queue[0].id}`)
      process.stdout.write('Ready: ')
      if (queue.length > 1) {
        queue.slice(1).forEach(proc => process.stdout.write(`P${proc.id} `))
        console.log()
      } else console.log()
    } else {
      console.log('CPU: ')
      console.log('Ready: ')
    }
  }

  prettyPrintIOQueue() {
    this.printers.forEach((printer, index) => {
      printer.prettyPrint(`P${index + 1}`)
    })
    this.disks.forEach((disk, index) => {
      disk.prettyPrint(`D${index + 1}`)
    })
  }

  prettyPrintMemory() {
    this.memory.forEach(block => {
      console.log(`P${block.pid} <${block.firstByte}, ${block.lastByte}>`)
    })
  }
}
