export default class InitialPrompt {
  questions = [
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

  constructor() {

  }

  positiveNumberValidation(input) {
    if (!isNaN(input) && input > 0) return true
    else return "Please enter a valid positive number"
  }

}
