import glob from 'glob'
import path from 'path'
import { Logger } from 'winston'
import CliExeNameProvider from './CliExeNameProvider'
import LoggerFactory from './LoggerFactory'

export default class ExecutableFileFinder implements IExecutableFileFinder {
  private readonly _cliName: string
  private readonly _provider: ICliExeNameProvider
  private readonly _log: Logger =
    LoggerFactory.create(ExecutableFileFinder.name)

  constructor(
    cliName: string,
    provider: ICliExeNameProvider = new CliExeNameProvider(cliName)) {
    this._cliName = cliName
    this._provider = provider
  }

  find(folderPath: string): string {
    const pattern: string =
      `${folderPath}${path.sep}**${path.sep}${this._cliName}*`
    const files: string[] = glob.sync(pattern)
      .filter((f: string) => f.endsWith(this._provider.getExeFileName()))
    if (files.length === 0) {
      throw new Error('Execution file has not been found under ' +
        `${folderPath} folder using ${pattern} pattern`)
    } else if (files.length > 1) {
      throw new Error('There are more than 1 execution file has been found ' +
        `under ${folderPath} folder using ${pattern} pattern: ${files}`)
    }
    this._log.info(`${this._cliName} path is ${files[0]}`)
    return files[0]
  }
}
