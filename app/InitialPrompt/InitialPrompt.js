export default class InitialPrompt {
  static questions = [
    {
      type: 'input',
      name: 'ram',
      message: 'RAM Capacity'
    },
    {
      type: 'input',
      name: 'disks',
      message: 'Disk Quantity'
    },
    {
      type: 'input',
      name: 'printers',
      message: 'Printer Quantity'
    }
  ]

  constructor() {

  }
}
