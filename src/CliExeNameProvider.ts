import os from 'os'

export default class CliExeNameProvider implements ICliExeNameProvider {
  private _cliName: string
  private _prefix: string

  constructor(cliName: string, prefix: string = '') {
    this._cliName = cliName
    this._prefix = prefix
  }

  getExeFileName(): string {
    switch (os.platform()) {
    case 'win32':
      return `${this._prefix}${this._cliName}.exe`
    default:
      return this._cliName
    }
  }
}
