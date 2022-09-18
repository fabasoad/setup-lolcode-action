import { sync } from 'command-exists'
import { Logger } from 'winston'
import LoggerFactory from './LoggerFactory'

export default abstract class InstallerBase implements IInstaller {
  private readonly exeFileName: string
  private readonly log: Logger = LoggerFactory.create(InstallerBase.name)

  protected constructor(provider: ICliExeNameProvider) {
    this.exeFileName = provider.getExeFileName()
  }

  protected abstract installInternal(): Promise<void>

  public async install(): Promise<void> {
    if (sync(this.exeFileName)) {
      this.log.info(`${this.exeFileName} is already installed. Skipped.`)
    } else {
      this.log.info(`Starting ${this.exeFileName} installation`)
      await this.installInternal()
    }
  }
}
