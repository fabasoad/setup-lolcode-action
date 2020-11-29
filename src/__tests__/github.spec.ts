// eslint-disable-next-line camelcase
import { execSync } from 'child_process'
import { mkdirSync } from 'fs'
import path from 'path'
import { clone } from '../github'

jest.mock('child_process')
jest.mock('fs')

describe('github', () => {
  it('clone should pass successfully', () => {
    const owner: string = 'lY5L080n'
    const repo: string = 'UGI49E2i'
    const tag: string = 'r6DOQto9'
    const to: string = '27XkVvCu'
    const actual: string = clone(owner, repo, tag, to)
    expect(actual).toBe(path.join(to, repo))
    expect(mkdirSync).toHaveBeenCalledWith(to, { recursive: true })
    expect(execSync).toHaveBeenCalledWith(
      `git clone --depth 1 --branch ${tag} https://github.com/${owner}/${repo}.git ${to}/${repo}`)
  })
})
