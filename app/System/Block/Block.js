export default class Block {
  constructor(proc, firstByte) {
    this.pid = proc.id
    this.size = proc.size
    this.firstByte = firstByte
    this.lastByte = firstByte + this.size - 1
  }
}
