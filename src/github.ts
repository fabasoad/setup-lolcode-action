import { execSync } from 'child_process'
import { mkdirSync } from 'fs'
import path from 'path'
import { Logger } from 'winston'
import LoggerFactory from './LoggerFactory'

const log: Logger = LoggerFactory.create('github')

export const clone =
  (owner: string, repo: string, tag: string, to: string): string => {
    mkdirSync(to, { recursive: true })
    const clonedPath: string = path.join(to, repo)
    const cmd1: string = `git clone --depth 1 --branch ${tag} https://github.com/${owner}/${repo}.git ${clonedPath}`
    log.info(`Running > ${cmd1}`)
    execSync(cmd1)
    log.info(`Cloned folder is ${clonedPath}`)
    return clonedPath
  }
