# Setup LCI - LOLCODE interpreter

![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-lolcode-action?include_prereleases) ![Unit Tests](https://github.com/fabasoad/setup-lolcode-action/workflows/Unit%20Tests/badge.svg) ![Functional Tests](https://github.com/fabasoad/setup-lolcode-action/workflows/Functional%20Tests/badge.svg) ![Security Tests](https://github.com/fabasoad/setup-lolcode-action/workflows/Security%20Tests/badge.svg) [![pre-commit.ci status](https://results.pre-commit.ci/badge/github/fabasoad/setup-lolcode-action/main.svg)](https://results.pre-commit.ci/latest/github/fabasoad/setup-lolcode-action/main) [![Total alerts](https://img.shields.io/lgtm/alerts/g/fabasoad/setup-lolcode-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/setup-lolcode-action/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/fabasoad/setup-lolcode-action.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/fabasoad/setup-lolcode-action/context:javascript) [![Maintainability](https://api.codeclimate.com/v1/badges/7c26e57f2c17d638150d/maintainability)](https://codeclimate.com/github/fabasoad/setup-lolcode-action/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/7c26e57f2c17d638150d/test_coverage)](https://codeclimate.com/github/fabasoad/setup-lolcode-action/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/fabasoad/setup-lolcode-action/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fabasoad/setup-lolcode-action?targetFile=package.json)

This action sets up a [LOLCODE](http://www.lolcode.org/) interpreter called [LCI](https://github.com/justinmeza/lci).

## Inputs

| Name    | Required | Description                                                                  | Default  | Possible values         |
|---------|----------|------------------------------------------------------------------------------|----------|-------------------------|
| version | No       | LCI version that can be found [here](https://github.com/justinmeza/lci/tags) | `0.11.2` | `0.9.2`, `0.10.5`, etc. |

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
name: Setup LCI

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

## Unsupported LCI versions

| OS      | Version                                       |
|---------|-----------------------------------------------|
| Windows | All                                           |
| Linux   | 0.9.1                                         |
| MacOS   | 0.9.1, 0.10.1, 0.10.2, 0.10.3, 0.10.4, 0.11.1 |
