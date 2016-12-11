import System from './System'
import Disk from './IODevice/Disk'
import Printer from './IODevice/Printer'
import Process from './Process'

describe('System', () => {
  let system
  const ramSize = 4000000000
  const diskQuantity = 2
  const printerQuantity = 1

  beforeEach(() => {
    system = new System(ramSize, diskQuantity, printerQuantity)
  })

  describe('Setup', () => {
    it('creates a proper system according to the input', () => {
      expect(system.ramSize).toEqual(ramSize)
      expect(system.disks.length).toEqual(diskQuantity)
      expect(system.printers.length).toEqual(printerQuantity)
    })

    it('has Disk objects in the disks property', () => {
      expect(system.disks[0] instanceof Disk).toEqual(true)
    })

    it('has Printer objects in the printers property', () => {
      expect(system.printers[0] instanceof Printer).toEqual(true)
    })

    it('has an empty array as a ready queue', () => {
      expect(system.readyQueue).toEqual([])
    })

    it('has an empty array as the memory management', () => {
      expect(system.memory).toEqual([])
    })
  })

  describe('Process addition', () => {
    const processSize = 123
    const processPriority = 12
    let proc

    beforeEach(() => {
      proc = new Process(processSize, processPriority)
    })

    it('adds a memory block to memory with the process\' id', () => {
      system.allocateMemory(proc)
      expect(system.memory.length).toEqual(1)

      const block = system.memory[0]
      expect(block.pid).toEqual(proc.id)
      expect(block.size).toEqual(proc.size)
    })

    it('adds the process to the ready queue', () => {
      system.pushReadyQueue(proc)
      expect(system.readyQueue.length).toEqual(1)
    })

    it('adds process to memory and ready queue at once', () => {
      system.addProcess(proc)
      expect(system.memory.length).toEqual(1)
      expect(system.readyQueue.length).toEqual(1)
    })
  })

  describe('Process deletion', () => {
    const processSize = 123
    const processPriority = 12
    let proc

    beforeEach(() => {
      proc = new Process(processSize, processPriority)
      system.allocateMemory(proc)
      system.pushReadyQueue(proc)
      system.deleteProcess(proc.id)
    })

    it('deletes the process from memory', () => {
      expect(system.memory.length).toEqual(0)
    })

    it('deletes the process from the ready queue', () => {
      expect(system.readyQueue.length).toEqual(0)
    })
  })

  describe('Memory management', () => {
    const proc1 = new Process(300, 1)
    const proc2 = new Process(200, 2)
    const proc3 = new Process(100, 3)
    const proc5 = new Process(ramSize - proc1.size - 100, 5)

    it('places memory at the beginning when the memory is empty', () => {
      const startAndIndex = system.getBestIndexAndStartByte(proc1)
      const expectedStartAndIndex = { index: 0, start: 0 }
      expect(startAndIndex).toEqual(expectedStartAndIndex)
    })

    it('finds the smallest block after the last block', () => {
      system.addProcess(proc1)
      system.addProcess(proc5)
      system.deleteProcess(proc1.id)
      const startAndIndex = system.getBestIndexAndStartByte(proc3)
      const expectedStartAndIndex = { index: 1, start: ramSize - 100 }
      expect(startAndIndex).toEqual(expectedStartAndIndex)
    })

    it('finds the smallest block before the first block', () => {
      system.addProcess(proc1)
      system.addProcess(proc5)
      system.deleteProcess(proc1.id)
      const startAndIndex = system.getBestIndexAndStartByte(proc2)
      const expectedStartAndIndex = { index: 0, start: 0 }
      expect(startAndIndex).toEqual(expectedStartAndIndex)
    })

    it('finds the smallest block between two blocks', () => {
      system.addProcess(proc1)
      system.addProcess(proc2)
      system.addProcess(proc3)
      system.deleteProcess(proc2.id)
      const startAndIndex = system.getBestIndexAndStartByte(proc2)
      const expectedStartAndIndex = { index: 1, start: 300 }
      expect(startAndIndex).toEqual(expectedStartAndIndex)
    })
  })

  describe('CPU scheduling', () => {
    const proc1 = new Process(300, 1)
    const proc2 = new Process(200, 3)
    const proc3 = new Process(100, 2)

    it('orders the processes in descending priority', () => {
      system.pushReadyQueue(proc1)
      system.pushReadyQueue(proc2)
      expect(system.readyQueue[0]).toBe(proc2)
      system.pushReadyQueue(proc3)
      expect(system.readyQueue[0]).toBe(proc2)
      expect(system.readyQueue[1]).toBe(proc3)
      expect(system.readyQueue[2]).toBe(proc1)
    })
  })

  describe('I/O Device handling', () => {
    const proc1 = new Process(300, 1)
    const proc2 = new Process(200, 2)
    const proc3 = new Process(100, 3)
    const proc4 = new Process(400, 4)

    beforeEach(() => {
      [proc1, proc2, proc3, proc4].forEach(proc => system.addProcess(proc))
    })

    it('moves current process into the respective printer queue', () => {
      expect(system.readyQueue.length).toEqual(4)
      system.print(1, '1.txt')
      expect(system.printers[0].queue[0].id).toEqual(proc4.id)
      expect(system.printers[0].queue[0].ioFileName).toEqual('1.txt')
      expect(system.readyQueue.length).toEqual(3)
    })

    it('moves current process into the respective disk queue', () => {
      expect(system.readyQueue.length).toEqual(4)
      system.diskIO(1, '1.txt')
      expect(system.disks[0].queue[0].id).toEqual(proc4.id)
      expect(system.disks[0].queue[0].ioFileName).toEqual('1.txt')
      expect(system.readyQueue.length).toEqual(3)
    })
  })
})
