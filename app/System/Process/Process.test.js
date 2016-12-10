import Process from './Process'

describe('Process', () => {
  describe('Setup', () => {
    it('creates new processes with incremental ids', () => {
      const processes = [...Array(3)].map(() => new Process())
      const pids = processes.map(p => p.pid)
      expect(pids).toEqual([1, 2, 3])
    })

    it('is intialized with a size and priority', () => {
      const processSize = 1400
      const processPriority = 7
      const proc = new Process(processSize, processPriority)
      expect(proc.size).toEqual(processSize)
      expect(proc.priority).toEqual(processPriority)
    })
  })
})
