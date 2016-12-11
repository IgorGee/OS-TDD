export default class IODevice {
  queue = []

  add(object) {
    this.queue.push(object)
  }

  remove() {
    return this.queue.shift()
  }

  prettyPrint(deviceName) {
    const queue = this.queue

    if (queue.length > 0) {
      console.log(`${deviceName}`)
      console.log(`  Serving: P${queue[0].id} (File: ${queue[0].ioFileName})`)
      process.stdout.write('  Queued: ')
      if (queue.length > 1) {
        queue.slice(1).forEach(proc => {
          process.stdout.write(`P${proc.id} (File: ${proc.ioFileName})`)
        })
        console.log()
      } else console.log()
    } else {
      console.log(`${deviceName}: Idle`)
    }
  }
}
