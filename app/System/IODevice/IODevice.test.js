import IODevice from './IODevice'

describe('IODevice', () => {
  let device

  beforeEach(() => {
    device = new IODevice()
  })

  it('has a queue', () => {
    expect(Array.isArray(device.queue)).toEqual(true)
  })

  it('adds Objects to the queue', () => {
    device.add('a')
    expect(device.queue.length).toEqual(1)
  })

  it('maintains order in which objects were added', () => {
    const objects = ['a', 'b', 'c']
    objects.forEach(object => device.add(object))
    expect(device.queue).toEqual(objects)
  })

  it('removes Objects from the queue', () => {
    device.add('a')
    device.remove()
    expect(device.queue.length).toEqual(0)
  })

  it('removes Object from the queue in a FIFO fashion', () => {
    const initial = ['a', 'b', 'c']
    const final = ['b', 'c']
    initial.forEach(object => device.add(object))
    device.remove()
    expect(device.queue).toEqual(final)
  })
})
