import Prompt from './Prompt'

describe('Initial prompt when starting program', () => {
  let questions

  beforeEach(() =>
    questions = new Prompt().initial
  )

  it('has 3 questions', () => {
    expect(questions.length).toEqual(3)

    questions.forEach(question => {
      expect(question.type in question)
      expect(question.name in question)
      expect(question.message in question)
    })
  })

  describe('First Question, RAM', () => {
    let question

    beforeEach(() => {
      question = questions[0]
    })

    it('has the proper question values', () => {
      expect(question.type).toEqual('input')
      expect(question.name).toEqual('ram')
      expect(question.message).toEqual('RAM Capacity:')
    })
  })

  describe('Second Question, Disks', () => {
    let question

    beforeEach(() => {
      question = questions[1]
    })

    it('has the proper question values', () => {
      expect(question.type).toEqual('input')
      expect(question.name).toEqual('disks')
      expect(question.message).toEqual('Disk Quantity:')
    })
  })

  describe('Third Question, Printers', () => {
    let question

    beforeEach(() => {
      question = questions[2]
    })

    it('has the proper question values', () => {
      expect(question.type).toEqual('input')
      expect(question.name).toEqual('printers')
      expect(question.message).toEqual('Printer Quantity:')
    })
  })
})
