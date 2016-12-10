import System from './System'

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
  })
})
