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
})
