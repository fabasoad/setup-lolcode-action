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
  private INSTALL_DIR: string = path.join(os.homedir(), '.local', 'bin')

  private _version: string
  private _clone: typeof clone
  private _cmakeProvider: ICliExeNameProvider
  private _makeProvider: ICliExeNameProvider
  private _lciFinder: IExecutableFileFinder
  private _cache: ICache
  private _log: Logger

  constructor(
    version: string,
    co: typeof clone = clone,
    lciProvider: ICliExeNameProvider = new CliExeNameProvider(LCI_CLI_NAME),
    cmakeProvider: ICliExeNameProvider = new CliExeNameProvider(CMAKE_CLI_NAME),
    makeProvider: ICliExeNameProvider = new CliExeNameProvider(MAKE_CLI_NAME),
    lciFinder: IExecutableFileFinder = new ExecutableFileFinder(LCI_CLI_NAME),
    cache: ICache = new Cache(version, LCI_CLI_NAME)) {
    super(lciProvider)
    this._version = version
    this._clone = co
    this._cmakeProvider = cmakeProvider
    this._makeProvider = makeProvider
    this._lciFinder = lciFinder
    this._cache = cache
    this._log = LoggerFactory.create('LciInstaller')
  }

  protected async installInternal(): Promise<void> {
    const owner: string = 'justinmeza'
    const repo: string = 'lci'
    const repoDir: string =
      this._clone(owner, repo, `v${this._version}`, this.INSTALL_DIR)

    process.chdir(repoDir)

    const cmd1: string = this._cmakeProvider.getExeFileName() + ' .'
    this._log.info(`Running > ${cmd1}`)
    execSync(cmd1, { stdio: 'inherit' })

    const cmd2: string = this._makeProvider.getExeFileName()
    this._log.info(`Running > ${cmd2}`)
    execSync(cmd2, { stdio: 'inherit' })

    const execFilePath: string = this._lciFinder.find(repoDir)
    addPath(path.dirname(execFilePath))
    this._cache.cache(execFilePath)
  }
}
