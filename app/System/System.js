export default class System {
  ramSize
  disks
  printerQuantity

  constructor(ramSize, diskQuantity, printerQuantity) {
    this.ramSize = ramSize
    this.disks = [...Array(diskQuantity)].map(() => new Object)
    this.printers = [...Array(printerQuantity)].map(() => new Object)
  }
}
