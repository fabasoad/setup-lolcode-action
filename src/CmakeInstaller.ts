/* eslint-disable max-len */
import { addPath } from '@actions/core'
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import Cache from './Cache'
import CliExeNameProvider from './CliExeNameProvider'
import { CMAKE_CLI_NAME } from './consts'
import ExecutableFileFinder from './ExecutableFileFinder'
import InstallerBase from './InstallerBase'
import LoggerFactory from './LoggerFactory'

export default class CmakeInstaller extends InstallerBase {
  private INSTALL_DIR: string = path.join(os.homedir(), '.local', 'bin')
  private _log: Logger = LoggerFactory.create('CmakeInstaller')
  private _version: string
  private _exeFileFinder: IExecutableFileFinder
  private _cache: ICache

  constructor(
    version: string,
    cmakeProvider: ICliExeNameProvider = new CliExeNameProvider(CMAKE_CLI_NAME),
    exeFileFinder: IExecutableFileFinder = new ExecutableFileFinder(CMAKE_CLI_NAME, cmakeProvider),
    cache: ICache = new Cache(version, CMAKE_CLI_NAME)) {
    super(cmakeProvider)
    this._version = version
    this._exeFileFinder = exeFileFinder
    this._cache = cache
  }

  private getUrl(os: string, arch: string = 'x86_64', ext: string = 'tar.gz'): string {
    return `https://github.com/Kitware/CMake/releases/download/v${this._version}/${CMAKE_CLI_NAME}-${this._version}-${os}-${arch}.${ext}`
  }

  protected async installInternal(): Promise<void> {
    fs.mkdirSync(this.INSTALL_DIR, { recursive: true })
    const osPlatform: string = os.platform()

    let dlCommand: string
    switch (osPlatform) {
    case 'linux':
      const urlLinux: string = this.getUrl('Linux')
      dlCommand = `curl -L ${urlLinux} | tar xz --wildcards --strip-components=1 -C ${this.INSTALL_DIR} \'*/${CMAKE_CLI_NAME}\'`
      break
    case 'darwin':
      const urlDarwin: string = this.getUrl('Darwin')
      dlCommand = `curl --insecure -L ${urlDarwin} | tar xz --strip-components=1 --include \'*/${CMAKE_CLI_NAME}\' -C ${this.INSTALL_DIR}`
      break
    case 'win32':
      const urlWindows: string = this.getUrl('win32', 'x86', 'zip')
      const zipPath: string = path.join(this.INSTALL_DIR, `${CMAKE_CLI_NAME}.zip`)
      const cmd1: string = `Invoke-WebRequest -OutFile ${zipPath} -Uri ${urlWindows}`
      const cmd2: string = `Expand-Archive ${zipPath} -DestinationPath ${this.INSTALL_DIR}`
      const cmd3: string = `Remove-Item ${zipPath}`
      dlCommand = `PowerShell.exe -Command "${cmd1}; ${cmd2}; ${cmd3}"`
      break
    default:
      throw new Error(`${osPlatform} OS is unsupported`)
    }

    this._log.info(`Executing command below to install ${CMAKE_CLI_NAME}...`)
    this._log.info(dlCommand)
    execSync(dlCommand)

    const execFilePath: string = this._exeFileFinder.find(this.INSTALL_DIR)
    const exeFolderPath: string = path.dirname(execFilePath)
    addPath(exeFolderPath)
    await this._cache.cache(execFilePath)
  }
}
