# Setup LCI - LOLCODE interpreter

![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-lolcode-action?include_prereleases)
![Functional Tests](https://github.com/fabasoad/setup-lolcode-action/workflows/Functional%20Tests/badge.svg)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/fabasoad/setup-lolcode-action/main.svg)](https://results.pre-commit.ci/latest/github/fabasoad/setup-lolcode-action/main)

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
