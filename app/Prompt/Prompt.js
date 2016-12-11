import Inquirer from 'inquirer'
import System from '../System'

export default class Prompt {
  initial = [
    {
      type: 'input',
      name: 'ram',
      message: 'RAM Capacity:',
      validate: this.positiveNumberValidation
    },
    {
      type: 'input',
      name: 'disks',
      message: 'Disk Quantity:',
      validate: this.positiveNumberValidation
    },
    {
      type: 'input',
      name: 'printers',
      message: 'Printer Quantity:',
      validate: this.positiveNumberValidation
    }
  ]

  newProcess = [
    {
      type: 'input',
      name: 'size',
      message: 'Size:',
      validate: this.positiveNumberValidation
    },
    {
      type: 'input',
      name: 'priority',
      message: 'Priority:',
      validate: this.positiveNumberValidation
    }
  ]

  newIOOperation = [
    {
      type: 'input',
      name: 'filename',
      message: 'Filename:'
    }
  ]

  listening = [
    {
      type: 'input',
      name: 'command',
      message: '>',
      validate: this.commandValidation
    }
  ]

  async getSystem() {
    try {
      const { ram, disks, printers } = await Inquirer.prompt(this.initial)
      return new System(ram, disks, printers)
    } catch (error) {
      console.error(error)
    }
  }

  positiveNumberValidation(input) {
    if (!isNaN(input) && input > 0) return true
    else return "Please enter a valid positive number"
  }

  commandValidation(input) {
    const commands = /^[At]$|^[DdPp]\d+$|^Sr$|^Si$|^Sm$/
    const valid = commands.test(input)
    if (valid) return valid
    else return "That is not a valid command"
  }

}
