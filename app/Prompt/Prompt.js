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

}
