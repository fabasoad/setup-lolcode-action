# Setup LCI - LOLCODE interpreter

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-lolcode-action?include_prereleases)
![functional-tests](https://github.com/fabasoad/setup-lolcode-action/actions/workflows/functional-tests.yml/badge.svg)
![security](https://github.com/fabasoad/setup-piet-action/actions/workflows/security.yml/badge.svg)
![linting](https://github.com/fabasoad/setup-lolcode-action/actions/workflows/linting.yml/badge.svg)

This action sets up a [LOLCODE](http://www.lolcode.org/) interpreter called [LCI](https://github.com/justinmeza/lci).

## Prerequisites

The following tools have to be installed for successful work of this GitHub action:
[git](https://git-scm.com), [cmake](https://cmake.org), [make](https://www.gnu.org/software/make/manual/make.html).

## Inputs

<!-- prettier-ignore-start -->
| Name    | Required | Description                                                                  | Default  | Possible values         |
|---------|----------|------------------------------------------------------------------------------|----------|-------------------------|
| version | No       | LCI version that can be found [here](https://github.com/justinmeza/lci/tags) | `0.11.2` | `0.9.2`, `0.10.5`, etc. |
<!-- prettier-ignore-end -->

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

```text
Run lci ./hello-world.lc
Hello World!
```

## Unsupported LCI versions

<!-- prettier-ignore-start -->
| OS      | Version                                       |
|---------|-----------------------------------------------|
| Windows | All                                           |
| Linux   | 0.9.1                                         |
| MacOS   | 0.9.1, 0.10.1, 0.10.2, 0.10.3, 0.10.4, 0.11.1 |
<!-- prettier-ignore-end -->
