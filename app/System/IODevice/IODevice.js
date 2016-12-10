export default class IODevice {
  queue = []

  add(object) {
    this.queue.push(object)
  }

  remove() {
    this.queue.shift()
  }
}
