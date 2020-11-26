import { error } from '@actions/core'
import CmakeInstaller from './CmakeInstaller'
import LciInstaller from './LciInstaller'

export const run = async (
  cmakeInstaller: IInstaller = new CmakeInstaller(''),
  lciInstaller: IInstaller = new LciInstaller(''),
  err: typeof error = error) => {
  try {
    await cmakeInstaller.install()
    await lciInstaller.install()
  } catch (e) {
    err((<Error>e).message)
  }
}

run()
