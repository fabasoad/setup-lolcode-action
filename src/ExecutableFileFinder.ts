import path from 'path'
import { Logger } from 'winston'
import CliExeNameProvider from './CliExeNameProvider'
import LoggerFactory from './LoggerFactory'
import {readdirSync, statSync} from 'fs';

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

  find(dirPath: string): string {
    const files: string[] = [dirPath]
    while (files.length > 0) {
      const filePath: string = files.pop() || ''
      if (statSync(filePath).isDirectory()) {
        readdirSync(filePath)
          .forEach((f: string) => files.push(`${filePath}${path.sep}${f}`))
      } else if (filePath.endsWith(this._provider.getExeFileName())) {
        this._log.info(`${this._cliName} path is ${filePath}`)
        return filePath
      }
    }
    throw new Error('Execution file has not been found under ' +
        `${dirPath} folder`)
  }
}
