// eslint-disable-next-line camelcase
import child_process, { ExecSyncOptions } from 'child_process'
import path from 'path'
import { restore, SinonStub, stub } from 'sinon'
import { clone } from '../github'

describe('github', () => {
  let execSyncStub: SinonStub<
    [command: string, options?: ExecSyncOptions], Buffer>

  beforeEach(() => {
    execSyncStub = stub(child_process, 'execSync')
  })

  it('clone should pass successfully', () => {
    const owner: string = 'lY5L080n'
    const repo: string = 'UGI49E2i'
    const tag: string = 'r6DOQto9'
    const to: string = '27XkVvCu'
    const actual: string = clone(owner, repo, tag, to)
    expect(actual).toBe(path.join(to, repo))
    execSyncStub.calledOnceWithExactly(
      `git clone --depth 1 --branch ${tag} https://github.com/${owner}/${repo}.git ${to}`)
  })

  afterEach(() => restore())
})
