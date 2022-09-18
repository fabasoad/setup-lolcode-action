import { addPath } from '@actions/core'
import { execSync } from 'child_process'
import os from 'os'
import path from 'path'
import { Logger } from 'winston'
import Cache from './Cache'
import CliExeNameProvider from './CliExeNameProvider'
import { CMAKE_CLI_NAME, LCI_CLI_NAME, MAKE_CLI_NAME } from './consts'
import ExecutableFileFinder from './ExecutableFileFinder'
import { clone } from './github'
import InstallerBase from './InstallerBase'
import LoggerFactory from './LoggerFactory'

export default class LciInstaller extends InstallerBase {
  private readonly INSTALL_DIR: string =
    path.join(os.homedir(), '.local', 'bin')
  private readonly _log: Logger = LoggerFactory.create(LciInstaller.name)

  private readonly _version: string
  private readonly _cmakeProvider: ICliExeNameProvider
  private readonly _makeProvider: ICliExeNameProvider
  private readonly _lciFinder: IExecutableFileFinder
  private readonly _cache: ICache

  constructor(
    version: string,
    lp: ICliExeNameProvider = new CliExeNameProvider(LCI_CLI_NAME),
    cp: ICliExeNameProvider = new CliExeNameProvider(CMAKE_CLI_NAME),
    mp: ICliExeNameProvider = new CliExeNameProvider(MAKE_CLI_NAME),
    lciFinder: IExecutableFileFinder = new ExecutableFileFinder(LCI_CLI_NAME),
    cache: ICache = new Cache(version, LCI_CLI_NAME)) {
    super(lp)
    this._version = version
    this._cmakeProvider = cp
    this._makeProvider = mp
    this._lciFinder = lciFinder
    this._cache = cache
  }

  protected async installInternal(): Promise<void> {
    if (os.platform() === 'win32') {
      throw new Error(`${os.type()} is not supported`)
    }
    const owner: string = 'justinmeza'
    const repo: string = 'lci'
    const repoDir: string =
      clone(owner, repo, `v${this._version}`, this.INSTALL_DIR)

    process.chdir(repoDir)

    const cmd1: string = this._cmakeProvider.getExeFileName() + ' .'
    this._log.info(`Running > ${cmd1}`)
    execSync(cmd1, { stdio: 'inherit' })

    const cmd2: string = this._makeProvider.getExeFileName()
    this._log.info(`Running > ${cmd2}`)
    execSync(cmd2, { stdio: 'inherit' })

    const execFilePath: string = this._lciFinder.find(repoDir)
    addPath(path.dirname(execFilePath))
    return this._cache.cache(execFilePath)
  }
}
