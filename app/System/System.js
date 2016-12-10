import Disk from './IODevice/Disk'
import Printer from './IODevice/Printer'

export default class System {
  ramSize
  disks
  printerQuantity

  constructor(ramSize, diskQuantity, printerQuantity) {
    this.ramSize = ramSize
    this.disks = [...Array(diskQuantity)].map(() => new Disk)
    this.printers = [...Array(printerQuantity)].map(() => new Printer)
  }
}
