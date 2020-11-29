import { addPath } from '@actions/core'
import { cacheDir } from '@actions/tool-cache'
import { chmodSync } from 'fs'
import path from 'path'
import { Logger } from 'winston'
import CliExeNameProvider from './CliExeNameProvider'
import LoggerFactory from './LoggerFactory'

export default class Cache implements ICache {
  private _log: Logger = LoggerFactory.create('Cache')
  private _version: string
  private _provider: ICliExeNameProvider

  constructor(
    version: string,
    cliName: string,
    provider: ICliExeNameProvider = new CliExeNameProvider(cliName)) {
    this._version = version
    this._provider = provider
  }

  async cache(execFilePath: string): Promise<void> {
    chmodSync(execFilePath, '777')
    this._log.info(
      `Access permissions of ${execFilePath} file was changed to 777.`)
    const folderPath: string = path.dirname(execFilePath)
    const cachedPath = await cacheDir(
      folderPath, this._provider.getExeFileName(), this._version)
    this._log.info(`Cached dir is ${cachedPath}`)
    addPath(cachedPath)
  }
}
