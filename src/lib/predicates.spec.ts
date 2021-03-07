import { schema } from './predicates'
import ow from 'ow'

describe('schema(ow predicate)', () => {
  it('validates object with schema', () => {
    const predicate = schema({
      stringProp: ow.string,
    })

    const result = ow.isValid({} as unknown, predicate)

    expect(result).toBe(false)
  })
  it('validates with nested schema', () => {
    const predicate = schema({
      parent: schema({
        stringProp: ow.string,
      }),
    })

    const result = ow.isValid({ parent: {} } as unknown, predicate)

    expect(result).toBe(false)
  })
})
