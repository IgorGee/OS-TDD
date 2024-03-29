import System from './System'
import Disk from './IODevice/Disk'
import Printer from './IODevice/Printer'
import Process from './Process'
import Block from './Block'

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

    it('does not add process to memory when it is bigger than RAM', () => {
      const bigProc = new Process(system.ramSize + 1, 1)
      system.addProcess(bigProc)
      expect(system.memory.length).toEqual(0)
      expect(system.readyQueue.length).toEqual(0)
    })

    it('does not add process to memory when memory is full', () => {
      const proc1 = new Process(system.ramSize / 2, 1)
      const proc2 = new Process(system.ramSize / 2, 1)
      const tinyProc = new Process(20, 2)
      system.addProcess(proc1)
      system.addProcess(proc2)
      system.addProcess(tinyProc)
      expect(system.memory.length).toEqual(2)
      expect(system.readyQueue.length).toEqual(2)
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
      system.deleteProcess()
    })

    it('deletes the process from memory', () => {
      expect(system.memory.length).toEqual(0)
    })

    it('deletes the process from the ready queue', () => {
      expect(system.readyQueue.length).toEqual(0)
    })

    it('returns false if ready queue is empty', () => {
      expect(system.deleteProcess()).toEqual(false)
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
      system.memory = [new Block(proc5, 300)]
      const startAndIndex = system.getBestIndexAndStartByte(proc3)
      const expectedStartAndIndex = { index: 1, start: ramSize - 100 }
      expect(startAndIndex).toEqual(expectedStartAndIndex)
    })

    it('finds the smallest block before the first block', () => {
      system.memory = [new Block(proc5, 300)]
      const startAndIndex = system.getBestIndexAndStartByte(proc2)
      const expectedStartAndIndex = { index: 0, start: 0 }
      expect(startAndIndex).toEqual(expectedStartAndIndex)
    })

    it('finds the smallest block between two blocks', () => {
      system.memory = [new Block(proc1, 0), new Block(proc3, 500)]
      const startAndIndex = system.getBestIndexAndStartByte(proc2)
      const expectedStartAndIndex = { index: 1, start: 300 }
      expect(startAndIndex).toEqual(expectedStartAndIndex)
    })

    it('returns undefined if the process size is too big', () => {
      const proc = new Process(system.ram + 1, 1)
      const startAndIndex = system.getBestIndexAndStartByte(proc)
      const expectedStartAndIndex = { index: undefined, start: undefined }
      expect(startAndIndex).toEqual(expectedStartAndIndex)
    })

    it('works properly with size 1 processes', () => {
      const proc1 = new Process(1, 1)
      const proc2 = new Process(1, 1)
      const proc3 = new Process(1, 1)
      const startAndIndex1 = system.getBestIndexAndStartByte(proc1)
      const expectedStartAndIndex1 = { index: 0, start: 0 }
      expect(startAndIndex1).toEqual(expectedStartAndIndex1)
      system.addProcess(proc1)

      const startAndIndex2 = system.getBestIndexAndStartByte(proc2)
      const expectedStartAndIndex2 = { index: 1, start: 1 }
      expect(startAndIndex2).toEqual(expectedStartAndIndex2)
      system.addProcess(proc2)

      const startAndIndex3 = system.getBestIndexAndStartByte(proc2)
      const expectedStartAndIndex3 = { index: 2, start: 2 }
      expect(startAndIndex3).toEqual(expectedStartAndIndex3)
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

    it('adds the process to the queue when it is the smallest priority', () => {
      system.pushReadyQueue(proc2)
      system.pushReadyQueue(proc1)
      expect(system.readyQueue[0]).toBe(proc2)
      expect(system.readyQueue[1]).toBe(proc1)
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

    it('terminates the print task and moves it back into ready queue', () => {
      const originalProc = system.readyQueue[0]
      expect(system.readyQueue.length).toEqual(4)
      system.print(1, '1.txt')
      system.finishPrint(1)
      expect(system.readyQueue.length).toEqual(4)
      expect(system.printers[0].queue.length).toEqual(0)
      expect(system.readyQueue[0]).toBe(originalProc)
    })

    it('terminates the diskIO task and moves it back into ready queue', () => {
      const originalProc = system.readyQueue[0]
      expect(system.readyQueue.length).toEqual(4)
      system.diskIO(1, '1.txt')
      system.finishDiskIO(1)
      expect(system.readyQueue.length).toEqual(4)
      expect(system.disks[0].queue.length).toEqual(0)
      expect(system.readyQueue[0]).toBe(originalProc)
    })
  })
})
