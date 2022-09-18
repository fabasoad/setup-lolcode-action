import { setFailed, getInput } from '@actions/core'
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
    private readonly msg: string
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
  let setFailedMocked

  beforeEach(() => {
    getInputMocked = jest.fn((m: string) => assert.isNotNull(m))
    setFailedMocked = jest.fn((m: string) => assert.isNotNull(m))
  })

  it('should run successfully', async () => {
    const cmakeInstallerMock: InstallerMock = new InstallerMock()
    const lciInstallerMock: InstallerMock = new InstallerMock()
    await run(
      getInputMocked as typeof getInput,
      setFailedMocked as typeof setFailed,
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
        setFailedMocked as typeof setFailed,
        item.cmakeInstaller,
        item.lciInstaller
      )
      expect(item[item.name].calls).toBe(item.expectedCalls)
      expect(setFailedMocked.mock.calls.length).toBe(1)
      expect(setFailedMocked.mock.calls[0][0]).toBe(expectedErrorMessage)
    })

  afterEach(() => {
    setFailedMocked.mockReset()
  })
})
