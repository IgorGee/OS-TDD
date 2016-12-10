export default class Process {
  static idCount = 1

  constructor(processSize, processPriority) {
    this.id = Process.idCount
    this.size = processSize
    this.priority = processPriority

    Process.idCount += 1
  }
}
