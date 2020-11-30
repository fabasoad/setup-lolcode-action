import os from 'os'

export default class CliExeNameProvider implements ICliExeNameProvider {
  private _cliName: string

  constructor(cliName: string) {
    this._cliName = cliName
  }

  getExeFileName(): string {
    switch (os.platform()) {
    case 'win32':
      return `${this._cliName}.exe`
    default:
      return this._cliName
    }
  }
}
