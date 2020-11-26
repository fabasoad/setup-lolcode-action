import { error, getInput } from '@actions/core'
import CmakeInstaller from './CmakeInstaller'
import LciInstaller from './LciInstaller'

export const run = async (
  gi: typeof getInput = getInput,
  err: typeof error = error,
  cmakeInstaller: IInstaller = new CmakeInstaller(gi('version')),
  lciInstaller: IInstaller = new LciInstaller(gi('version'))) => {
  try {
    await cmakeInstaller.install()
    await lciInstaller.install()
  } catch (e) {
    err((<Error>e).message)
  }
}

run()
