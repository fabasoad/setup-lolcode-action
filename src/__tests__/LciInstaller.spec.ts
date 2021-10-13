/* eslint-disable no-unused-vars */
import * as core from '@actions/core'
// eslint-disable-next-line camelcase
import child_process, { ExecSyncOptions } from 'child_process'
import commandExists from 'command-exists'
import itParam from 'mocha-param'
import os from 'os'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import * as github from '../github'
import LciInstaller from '../LciInstaller'

describe('LciInstaller', () => {
  const installDir: string = path.join(os.homedir(), '.local', 'bin')

  let osPlatformStub: SinonStub<[], string>
  let osTypeStub: SinonStub<[], string>
  let githubCloneStub: SinonStub<
    [owner: string, repo: string, tag: string, to: string], string>
  let execSyncStub: SinonStub<
    [command: string, options?: ExecSyncOptions], string | Buffer>
  let commandExistsStub: SinonStub<[commandName: string], boolean>
  let chdirStub: SinonStub<[directory: string], void>
  let addPathStub: SinonStub<[inputPath: string], void>

  beforeEach(() => {
    osPlatformStub = stub(os, 'platform')
    osTypeStub = stub(os, 'type')
    githubCloneStub = stub(github, 'clone')
    execSyncStub = stub(child_process, 'execSync')
    commandExistsStub = stub(commandExists, 'sync')
    chdirStub = stub(process, 'chdir')
    addPathStub = stub(core, 'addPath')
  })

  itParam('should install successfully (${value})',
    ['darwin', 'linux'], async (platform: string) => {
      const version: string = '6n33xNNt'
      const repo: string = 'lci'
      const repoDir: string = '5zs1kbe5'
      commandExistsStub.returns(false)
      osPlatformStub.returns(platform)
      githubCloneStub.returns(repoDir)

      const makeExeFileName: string = '629mkl7f'
      const getMakeExeFileNameMock = jest.fn(() => makeExeFileName)
      const cmakeExeFileName: string = 'ORkJA6n9'
      const getCmakeExeFileNameMock = jest.fn(() => cmakeExeFileName)
      const lciExeFileName: string = 'ORkJA6n9'
      const getLciExeFileNameMock = jest.fn(() => lciExeFileName)

      const execFileDir: string = 'Tw2t0L1N'
      const execFilePath: string = path.join(execFileDir, 'hw3a7g60')
      const findMock = jest.fn((f: string) => execFilePath)

      const cacheMock = jest.fn()

      const installer: LciInstaller = new LciInstaller(
        version,
        { getExeFileName: getLciExeFileNameMock },
        { getExeFileName: getCmakeExeFileNameMock },
        { getExeFileName: getMakeExeFileNameMock },
        { find: findMock },
        { cache: cacheMock })
      expect(getLciExeFileNameMock.mock.calls.length).toBe(1)
      await installer.install()

      expect(commandExistsStub.withArgs(lciExeFileName).callCount).toBe(1)
      expect(githubCloneStub.withArgs(
        'justinmeza', repo, `v${version}`, installDir).callCount).toBe(1)
      expect(chdirStub.withArgs(repoDir).callCount).toBe(1)
      expect(getCmakeExeFileNameMock.mock.calls.length).toBe(1)
      expect(execSyncStub.withArgs(
        `${cmakeExeFileName} .`, { stdio: 'inherit' }).callCount).toBe(1)
      expect(getMakeExeFileNameMock.mock.calls.length).toBe(1)
      expect(execSyncStub.withArgs(
        makeExeFileName, { stdio: 'inherit' }).callCount).toBe(1)
      expect(findMock.mock.calls.length).toBe(1)
      expect(findMock.mock.calls[0][0]).toBe(repoDir)
      expect(addPathStub.withArgs(execFileDir).callCount).toBe(1)
      expect(cacheMock.mock.calls.length).toBe(1)
      expect(cacheMock.mock.calls[0][0]).toBe(execFilePath)
    })

  it('should skip installation (win32)', async () => {
    const version: string = '6n33xNNt'
    const repoDir: string = '5zs1kbe5'
    const osType: string = 'k15g21G0'
    commandExistsStub.returns(false)
    osPlatformStub.returns('win32')
    osTypeStub.returns(osType)
    githubCloneStub.returns(repoDir)

    const makeExeFileName: string = '629mkl7f'
    const getMakeExeFileNameMock = jest.fn(() => makeExeFileName)
    const cmakeExeFileName: string = 'ORkJA6n9'
    const getCmakeExeFileNameMock = jest.fn(() => cmakeExeFileName)
    const lciExeFileName: string = 'ORkJA6n9'
    const getLciExeFileNameMock = jest.fn(() => lciExeFileName)

    const execFileDir: string = 'Tw2t0L1N'
    const execFilePath: string = path.join(execFileDir, 'hw3a7g60')
    const findMock = jest.fn((f: string) => execFilePath)

    const cacheMock = jest.fn()

    const installer: LciInstaller = new LciInstaller(
      version,
      { getExeFileName: getLciExeFileNameMock },
      { getExeFileName: getCmakeExeFileNameMock },
      { getExeFileName: getMakeExeFileNameMock },
      { find: findMock },
      { cache: cacheMock })
    expect(getLciExeFileNameMock.mock.calls.length).toBe(1)
    let flag: boolean = false
    try {
      await installer.install()
    } catch (e) {
      expect((<Error>e).message).toBe(`${osType} is not supported`)
      flag = true
    }

    expect(flag).toBeTruthy()
    expect(commandExistsStub.withArgs(lciExeFileName).callCount).toBe(1)
    expect(githubCloneStub.called).toBeFalsy()
    expect(chdirStub.called).toBeFalsy()
    expect(getCmakeExeFileNameMock.mock.calls.length).toBe(0)
    expect(execSyncStub.called).toBeFalsy()
    expect(getMakeExeFileNameMock.mock.calls.length).toBe(0)
    expect(findMock.mock.calls.length).toBe(0)
    expect(addPathStub.called).toBeFalsy()
    expect(cacheMock.mock.calls.length).toBe(0)
  })

  itParam('should be skipped as it is already installed (${value})',
    ['darwin', 'linux', 'win32'], async (platform: string) => {
      const version: string = '6n33xNNt'
      const repoDir: string = '5zs1kbe5'
      const osType: string = 'k15g21G0'
      commandExistsStub.returns(true)
      osPlatformStub.returns(platform)
      osTypeStub.returns(osType)
      githubCloneStub.returns(repoDir)

      const makeExeFileName: string = '629mkl7f'
      const getMakeExeFileNameMock = jest.fn(() => makeExeFileName)
      const cmakeExeFileName: string = 'ORkJA6n9'
      const getCmakeExeFileNameMock = jest.fn(() => cmakeExeFileName)
      const lciExeFileName: string = 'ORkJA6n9'
      const getLciExeFileNameMock = jest.fn(() => lciExeFileName)

      const execFileDir: string = 'Tw2t0L1N'
      const execFilePath: string = path.join(execFileDir, 'hw3a7g60')
      const findMock = jest.fn((f: string) => execFilePath)

      const cacheMock = jest.fn()

      const installer: LciInstaller = new LciInstaller(
        version,
        { getExeFileName: getLciExeFileNameMock },
        { getExeFileName: getCmakeExeFileNameMock },
        { getExeFileName: getMakeExeFileNameMock },
        { find: findMock },
        { cache: cacheMock })
      expect(getLciExeFileNameMock.mock.calls.length).toBe(1)
      await installer.install()

      expect(commandExistsStub.withArgs(lciExeFileName).callCount).toBe(1)
      expect(githubCloneStub.called).toBeFalsy()
      expect(chdirStub.called).toBeFalsy()
      expect(getCmakeExeFileNameMock.mock.calls.length).toBe(0)
      expect(execSyncStub.called).toBeFalsy()
      expect(getMakeExeFileNameMock.mock.calls.length).toBe(0)
      expect(findMock.mock.calls.length).toBe(0)
      expect(addPathStub.called).toBeFalsy()
      expect(cacheMock.mock.calls.length).toBe(0)
    })

  afterEach(() => restore())
})
