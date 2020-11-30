import { error, getInput } from '@actions/core'
import { assert } from 'chai'
import itParam from 'mocha-param'
import { run } from '../index'

describe('index > run', () => {
  class InstallerMock {
      calls: number = 0
      async install(): Promise<void> {
        this.calls++
        return Promise.resolve()
      }
  }

  interface INegativeTestFixture {
    name: string
    cmakeInstaller: any
    lciInstaller: any
    expectedCalls: number
  }

  const expectedErrorMessage: string = '0a77hs2u'
  class InstallerErrorMock {
    private msg: string
    constructor(msg: string) {
      this.msg = msg
    }
    install(): Promise<void> {
      throw new Error(this.msg)
    }
  }

  const items: INegativeTestFixture[] = [{
    cmakeInstaller: new InstallerMock(),
    lciInstaller: new InstallerErrorMock(expectedErrorMessage),
    name: 'cmakeInstaller',
    expectedCalls: 1
  }, {
    cmakeInstaller: new InstallerErrorMock(expectedErrorMessage),
    lciInstaller: new InstallerMock(),
    name: 'lciInstaller',
    expectedCalls: 0
  }]

  let getInputMocked
  let errorMocked

  beforeEach(() => {
    getInputMocked = jest.fn((m: string) => assert.isNotNull(m))
    errorMocked = jest.fn((m: string) => assert.isNotNull(m))
  })

  it('should run successfully', async () => {
    const cmakeInstallerMock: InstallerMock = new InstallerMock()
    const lciInstallerMock: InstallerMock = new InstallerMock()
    await run(
      getInputMocked as typeof getInput,
      errorMocked as typeof error,
      cmakeInstallerMock,
      lciInstallerMock
    )
    expect(cmakeInstallerMock.calls).toBe(1)
    expect(lciInstallerMock.calls).toBe(1)
  })

  itParam('should print error (${value.name})',
    items, async (item: INegativeTestFixture) => {
      await run(
        getInputMocked as typeof getInput,
        errorMocked as typeof error,
        item.cmakeInstaller,
        item.lciInstaller
      )
      expect(item[item.name].calls).toBe(item.expectedCalls)
      expect(errorMocked.mock.calls.length).toBe(1)
      expect(errorMocked.mock.calls[0][0]).toBe(expectedErrorMessage)
    })

  afterEach(() => {
    errorMocked.mockReset()
  })
})
