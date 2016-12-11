export default class IODevice {
  queue = []

  add(object) {
    this.queue.push(object)
  }

  remove() {
    return this.queue.shift()
  }
}
