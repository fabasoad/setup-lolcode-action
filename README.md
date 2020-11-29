# Setup LOLCODE

![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-lolcode-action?include_prereleases) ![CI (latest)](https://github.com/fabasoad/setup-lolcode-action/workflows/CI%20(latest)/badge.svg) ![CI (main)](https://github.com/fabasoad/setup-lolcode-action/workflows/CI%20(main)/badge.svg) ![YAML Lint](https://github.com/fabasoad/setup-lolcode-action/workflows/YAML%20Lint/badge.svg) ![CodeQL](https://github.com/fabasoad/setup-lolcode-action/workflows/CodeQL/badge.svg) [![Total alerts](https://img.shields.io/lgtm/alerts/g/fabasoad/setup-lolcode-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/setup-lolcode-action/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/fabasoad/setup-lolcode-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/setup-lolcode-action/context:javascript) [![Maintainability](https://api.codeclimate.com/v1/badges/7c26e57f2c17d638150d/maintainability)](https://codeclimate.com/github/fabasoad/setup-lolcode-action/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/7c26e57f2c17d638150d/test_coverage)](https://codeclimate.com/github/fabasoad/setup-lolcode-action/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/fabasoad/setup-lolcode-action/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fabasoad/setup-lolcode-action?targetFile=package.json)

This action sets up a [LOLCODE](http://www.lolcode.org/) interpreter called [LCI](https://github.com/justinmeza/lci).

## Inputs

| Name    | Required | Description                                                                      | Default   | Possible values          |
|---------|----------|----------------------------------------------------------------------------------|-----------|--------------------------|
| version | No       | LCI version that can be found [here](https://github.com/justinmeza/lci/releases) | `0.11.2`  | `0.9.2`, `0.10.3`, etc.  |

## Example usage

Let's try to run `hello-world.lc` file with the following content:

```cobol
HAI 1.2
  CAN HAS STDIO?
  VISIBLE "Hello World!"
KTHXBYE
```

### Workflow configuration

```yaml
name: Setup LOLCODE

on: push

jobs:
  setup:
    name: Setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@main
      - uses: fabasoad/setup-lolcode-action@main
      - name: Run script
        run: lci ./hello-world.lc
```

### Result

```shell
Run lci ./hello-world.lc
Hello World!
```

## Restrictions

Currently this GitHub Actions doesn't support the following cases:

1. OS: [Windows](https://github.com/justinmeza/lci/issues/44)
1. LCI version:
    1. `0.9.1` [for Linux](https://github.com/fabasoad/setup-lolcode-action/actions/runs/389983860)
    1. `0.10.1` [for MacOS](https://github.com/fabasoad/setup-lolcode-action/actions/runs/389991819)
    1. 
