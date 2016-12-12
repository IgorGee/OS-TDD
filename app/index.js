import Prompt from './Prompt'

const awaitCommand = async system => {
  while (true) {
    const { command } = await (new Prompt).getCommand()

    switch (command[0]) {
      case 'A':
        const proc = await (new Prompt).getNewProcess()
        if (!system.addProcess(proc)) console.log("No room for this process")
        break
      case 't':
        if (!system.deleteProcess())
          console.log("There are no processes in CPU or Ready Queue")
        break
      case 'p':
        const newPrinterNumber = parseInt(command.substring(1))
        if (newPrinterNumber > system.printers.length) {
          console.log(`P${newPrinterNumber} does not exist`)
          break
        }
        const pFilename = await (new Prompt).getFilename()
        if (!system.print(newPrinterNumber, pFilename))
          console.log('There are no processes in CPU or Ready Queue')
        break
      case 'P':
        const finishPrinterNumber = parseInt(command.substring(1))
        if (finishPrinterNumber > system.printers.length) {
          console.log(`P${finishPrinterNumber} does not exist`)
          break
        }
        if (!system.finishPrint(finishPrinterNumber))
          console.log('There are no processes using this IO device')
        break
      case 'd':
        const newDiskNumber = parseInt(command.substring(1))
        if (newDiskNumber > system.disks.length) {
          console.log(`D${newDiskNumber} does not exist`)
          break
        }
        const dFilename = await (new Prompt).getFilename()
        if (!system.diskIO(newDiskNumber, dFilename))
          console.log('There are no processes in CPU or Ready Queue')
        break
      case 'D':
        const finishDiskNumber = parseInt(command.substring(1))
        if (finishDiskNumber > system.disks.length) {
          console.log(`D${finishDiskNumber} does not exist`)
          break
        }
        if (!system.finishDiskIO(finishDiskNumber))
          console.log('There are no processes using this IO device')
        break
      case 'S':
        switch (command[1]) {
          case 'r':
            system.prettyPrintReadyQueue()
            break
          case 'i':
            system.prettyPrintIOQueue()
            break
          case 'm':
            system.prettyPrintMemory()
            break
          default:
            console.log("Incorrect command")
        }
        break
      default:
        console.log("Incorrect command")
    }
  }
}

const startSystem = async () => {
  const system = await (new Prompt).getSystem()
  awaitCommand(system)
}

startSystem()
