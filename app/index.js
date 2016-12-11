import Prompt from './Prompt'

const awaitCommand = async system => {
  while (true) {
    const { command } = await (new Prompt).getCommand()

    switch (command[0]) {
      case 'A':
        const proc = await (new Prompt).getNewProcess()
        system.addProcess(proc)
        break
      case 't':
        system.deleteProcess()
        break
      case 'p':
        const newPrinterNumber = parseInt(command.substring(1))
        const pFilename = await (new Prompt).getFilename()
        system.print(newPrinterNumber, pFilename)
        break
      case 'P':
        const finishPrinterNumber = parseInt(command.substring(1))
        system.finishPrint(finishPrinterNumber)
        break
      case 'd':
        const newDiskNumber = parseInt(command.substring(1))
        const dFilename = await (new Prompt).getFilename()
        system.diskIO(newDiskNumber, dFilename)
        break
      case 'D':
        const finishDiskNumber = parseInt(command.substring(1))
        system.finishDiskIO(finishDiskNumber)
        break
      case 'S':
        switch (command[1]) {
          case 'r':
            console.log(system.readyQueue)
            break
          case 'i':
            console.log(system.printers)
            console.log(system.disks)
            break
          case 'm':
            console.log(system.memory)
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
