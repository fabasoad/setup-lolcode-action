/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import * as core from '@actions/core'
// eslint-disable-next-line camelcase
import child_process, { ExecSyncOptions } from 'child_process'
import commandExists from 'command-exists'
import fs from 'fs'
import itParam from 'mocha-param'
import os from 'os'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import CmakeInstaller from '../CmakeInstaller'
import { CMAKE_CLI_NAME } from '../consts'

describe('CmakeInstaller', () => {
  const installDir: string = path.join(os.homedir(), '.local', 'bin')

  interface IFixture {
    platform: string
    getCommand(v: string): string
  }

  abstract class FixtureBase implements IFixture {
    abstract platform: string
    abstract getCommand(v: string): string
    protected getUrl(v: string, os: string, arch: string, ext: string): string {
      return `https://github.com/Kitware/CMake/releases/download/v${v}/${CMAKE_CLI_NAME}-${v}-${os}-${arch}.${ext}`
    }
  }

  class LinuxFixture extends FixtureBase {
    platform: string = 'linux'
    getCommand(v: string): string {
      const url: string = this.getUrl(v, 'Linux', 'x86_64', 'tar.gz')
      return `curl -L ${url} | tar xz --wildcards --strip-components=1 -C ${installDir} \'*/${CMAKE_CLI_NAME}\'`
    }
  }

  class DarwinFixture extends FixtureBase {
    platform: string = 'darwin'
    getCommand(v: string): string {
      const url: string = this.getUrl(v, 'Darwin', 'x86_64', 'tar.gz')
      return `curl --insecure -L ${url} | tar xz --strip-components=1 --include \'*/${CMAKE_CLI_NAME}\' -C ${installDir}`
    }
  }

  class WindowsFixture extends FixtureBase {
    platform: string = 'win32'
    getCommand(v: string): string {
      const url: string = this.getUrl(v, 'win32', 'x86', 'zip')
      const zipPath: string = path.join(installDir, `${CMAKE_CLI_NAME}.zip`)
      const cmd1: string =
        `Invoke-WebRequest -OutFile ${zipPath} -Uri ${url}`
      const cmd2: string =
        `Expand-Archive ${zipPath} -DestinationPath ${installDir}`
      const cmd3: string = `Remove-Item ${zipPath}`
      return `PowerShell.exe -Command "${cmd1}; ${cmd2}; ${cmd3}"`
    }
  }

  const items: IFixture[] = [
    new LinuxFixture(),
    new DarwinFixture(),
    new WindowsFixture()
  ]

  let fsMkdirSyncStub: SinonStub<
    [path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions | null],
      string | undefined>
  let osPlatformStub: SinonStub<[], string>
  let execSyncStub: SinonStub<
    [command: string, options?: ExecSyncOptions], string | Buffer>
  let addPathStub: SinonStub<[inputPath: string], void>
  let commandExistsStub: SinonStub<[commandName: string], boolean>

  beforeEach(() => {
    fsMkdirSyncStub = stub(fs, 'mkdirSync')
    osPlatformStub = stub(os, 'platform')
    execSyncStub = stub(child_process, 'execSync')
    addPathStub = stub(core, 'addPath')
    commandExistsStub = stub(commandExists, 'sync')
  })

  itParam('should install successfully (${value.platform})',
    items, async (item: IFixture) => {
      const version: string = 'C02PDk6g'
      const cmakeExeFileName: string = 'RAZ1Hpk4'
      const exeFolderPath: string = '8Ca8Al03'
      const execFilePath: string = path.join(exeFolderPath, cmakeExeFileName)
      commandExistsStub.returns(false)
      osPlatformStub.returns(item.platform)
      const getCmakeExeFileNameMock = jest.fn(() => cmakeExeFileName)
      const findMock = jest.fn((d: string) => execFilePath)
      const cacheMock = jest.fn((p: string) => Promise.resolve())
      const installer: CmakeInstaller = new CmakeInstaller(
        version,
        { getExeFileName: getCmakeExeFileNameMock },
        { find: findMock },
        { cache: cacheMock }
      )
      await installer.install()
      expect(getCmakeExeFileNameMock.mock.calls.length).toBe(1)
      expect(commandExistsStub.withArgs(cmakeExeFileName).callCount).toBe(1)
      expect(fsMkdirSyncStub.withArgs(installDir, { recursive: true }).callCount).toBe(1)
      expect(execSyncStub.withArgs(item.getCommand(version)).callCount).toBe(1)
      expect(findMock.mock.calls.length).toBe(1)
      expect(findMock.mock.calls[0][0]).toBe(installDir)
      expect(addPathStub.withArgs(exeFolderPath).callCount).toBe(1)
      expect(cacheMock.mock.calls.length).toBe(1)
      expect(cacheMock.mock.calls[0][0]).toBe(execFilePath)
    })

  it('should not install', async () => {
    const version: string = 'C02PDk6g'
    const cmakeExeFileName: string = 'RAZ1Hpk4'
    commandExistsStub.returns(true)
    const getCmakeExeFileNameMock = jest.fn(() => cmakeExeFileName)
    const findMock = jest.fn((d: string) => 'A9dA1or1')
    const cacheMock = jest.fn((p: string) => Promise.resolve())
    const installer: CmakeInstaller = new CmakeInstaller(
      version,
      { getExeFileName: getCmakeExeFileNameMock },
      { find: findMock },
      { cache: cacheMock }
    )
    await installer.install()
    expect(commandExistsStub.withArgs(cmakeExeFileName).callCount).toBe(1)
    expect(findMock.mock.calls.length).toBe(0)
    expect(fsMkdirSyncStub.called).toBeFalsy()
    expect(execSyncStub.called).toBeFalsy()
    expect(addPathStub.called).toBeFalsy()
    expect(getCmakeExeFileNameMock.mock.calls.length).toBe(1)
    expect(cacheMock.mock.calls.length).toBe(0)
  })

  it('should throw error in case of unsupported OS', async () => {
    const version: string = 'C02PDk6g'
    commandExistsStub.returns(false)
    osPlatformStub.returns('1pR71dal')
    const cmakeExeFileName: string = 'o71xzjDK'
    const getCmakeExeFileNameMock = jest.fn(() => cmakeExeFileName)
    const findMock = jest.fn((d: string) => 'A9dA1or1')
    const cacheMock = jest.fn((p: string) => Promise.resolve())
    const installer: CmakeInstaller = new CmakeInstaller(
      version,
      { getExeFileName: getCmakeExeFileNameMock },
      { find: findMock },
      { cache: cacheMock }
    )
    let flag: boolean = false
    try {
      await installer.install()
    } catch (e) {
      flag = true
    }
    expect(flag).toBeTruthy()
    expect(getCmakeExeFileNameMock.mock.calls.length).toBe(1)
    expect(commandExistsStub.withArgs(cmakeExeFileName).callCount).toBe(1)
    expect(fsMkdirSyncStub.withArgs(installDir, { recursive: true }).callCount).toBe(1)
    expect(execSyncStub.notCalled).toBeTruthy()
    expect(findMock.mock.calls.length).toBe(0)
    expect(addPathStub.notCalled).toBeTruthy()
    expect(cacheMock.mock.calls.length).toBe(0)
  })

  afterEach(() => restore())
})
