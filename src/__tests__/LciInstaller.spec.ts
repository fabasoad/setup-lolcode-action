/* eslint-disable no-unused-vars */
// eslint-disable-next-line camelcase
import child_process, { ExecSyncOptions } from 'child_process'
import commandExists from 'command-exists'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import * as github from '../github'
import LciInstaller from '../LciInstaller'

describe('LciInstaller', () => {
  let githubCloneStub: SinonStub<
    [owner: string, repo: string, tag: string, to?: string], string>
  let execSyncStub: SinonStub<
    [command: string, options?: ExecSyncOptions], Buffer>
  let commandExistsStub: SinonStub<[commandName: string], boolean>

  beforeEach(() => {
    githubCloneStub = stub(github, 'clone')
    execSyncStub = stub(child_process, 'execSync')
    commandExistsStub = stub(commandExists, 'sync')
  })

  it.skip('should install successfully', async () => {
    const version: string = '6n33xNNt'
    const repo: string = 'kitten'
    const repoDir: string = '5zs1kbe5'
    const stackYamlPath: string = path.join(repoDir, 'stack.yaml')
    commandExistsStub.returns(false)
    githubCloneStub.returns(repoDir)

    const makeExeFileName: string = '629mkl7f'
    const getMakeExeFileNameMock = jest.fn(() => makeExeFileName)
    const cmakeExeFileName: string = 'ORkJA6n9'
    const getCmakeExeFileNameMock = jest.fn(() => cmakeExeFileName)
    const lciExeFileName: string = 'ORkJA6n9'
    const getLciExeFileNameMock = jest.fn(() => lciExeFileName)

    const execFilePath: string = 'hw3a7g60'
    const findMock = jest.fn((f: string) => execFilePath)

    const cacheMock = jest.fn()

    const installer: LciInstaller = new LciInstaller(
      version,
      githubCloneStub,
      { getExeFileName: getLciExeFileNameMock },
      { getExeFileName: getCmakeExeFileNameMock },
      { getExeFileName: getMakeExeFileNameMock },
      { find: findMock },
      { cache: cacheMock })
    expect(getLciExeFileNameMock.mock.calls.length).toBe(1)
    await installer.install()

    commandExistsStub.calledOnceWithExactly(lciExeFileName)
    expect(getCmakeExeFileNameMock.mock.calls.length).toBe(1)
    githubCloneStub.calledOnceWithExactly('justinmeza', repo, `v${version}`)
    execSyncStub.getCall(0).calledWithExactly(
      `${cmakeExeFileName} setup --stack-yaml ${stackYamlPath}`)
    execSyncStub.getCall(1).calledWithExactly(
      `${cmakeExeFileName} build --stack-yaml ${stackYamlPath}`)
    expect(findMock.mock.calls.length).toBe(1)
    expect(findMock.mock.calls[0][0])
      .toBe(path.join(repoDir, '.stack-work', 'install'))
    expect(cacheMock.mock.calls.length).toBe(1)
    expect(cacheMock.mock.calls[0][0]).toBe(execFilePath)
  })

  it.skip('should not install', async () => {
    const version: string = '6n33xNNt'
    commandExistsStub.returns(true)
    githubCloneStub.returns('Y9xoTYs3')

    const getMakeExeFileNameMock = jest.fn(() => 's0fS31kf')
    const getLciExeFileNameMock = jest.fn(() => '629mkl7f')
    const kittenExeFileName: string = 'ORkJA6n9'
    const getCmakeExeFileNameMock = jest.fn(() => kittenExeFileName)
    const findMock = jest.fn((f: string) => 'hw3a7g60')
    const cacheMock = jest.fn()

    const installer: LciInstaller = new LciInstaller(
      version,
      githubCloneStub,
      { getExeFileName: getLciExeFileNameMock },
      { getExeFileName: getCmakeExeFileNameMock },
      { getExeFileName: getMakeExeFileNameMock },
      { find: findMock },
      { cache: cacheMock })
    expect(getLciExeFileNameMock.mock.calls.length).toBe(1)
    await installer.install()

    commandExistsStub.calledOnceWithExactly(kittenExeFileName)
    expect(getCmakeExeFileNameMock.mock.calls.length).toBe(0)
    expect(githubCloneStub.called).toBeFalsy()
    expect(execSyncStub.called).toBeFalsy()
    expect(findMock.mock.calls.length).toBe(0)
    expect(cacheMock.mock.calls.length).toBe(0)
  })

  afterEach(() => restore())
})
