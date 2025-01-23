# Setup LCI - LOLCODE interpreter

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://stand-with-ukraine.pp.ua)
![GitHub release](https://img.shields.io/github/v/release/fabasoad/setup-lolcode-action?include_prereleases)
![functional-tests](https://github.com/fabasoad/setup-lolcode-action/actions/workflows/functional-tests.yml/badge.svg)
![security](https://github.com/fabasoad/setup-piet-action/actions/workflows/security.yml/badge.svg)
![linting](https://github.com/fabasoad/setup-lolcode-action/actions/workflows/linting.yml/badge.svg)

This action sets up a [LOLCODE](http://www.lolcode.org/) interpreter called [LCI](https://github.com/justinmeza/lci).

## Unsupported LCI versions

<!-- prettier-ignore-start -->
| OS      | Version                                       |
|---------|-----------------------------------------------|
| Windows | All                                           |
| Linux   | 0.9.1                                         |
| macOS   | 0.9.1, 0.10.1, 0.10.2, 0.10.3, 0.10.4, 0.11.1 |
<!-- prettier-ignore-end -->

## Prerequisites

The following tools have to be installed for successful work of this GitHub action:
[cmake](https://cmake.org), [make](https://www.gnu.org/software/make/manual/make.html).

## Inputs

```yaml
- uses: fabasoad/setup-lolcode-action@v1
  with:
    # (Optional) LCI version. Defaults to the latest version.
    version: "0.11.2"
    # (Optional) If "true" it installs LCI even if it is already installed on a
    # runner. Otherwise, skips installation.
    force: "false"
    # (Optional) GitHub token that is used to send requests to GitHub API such
    # as getting latest release. Defaults to the token provided by GitHub Actions
    # environment.
    github-token: "${{ github.token }}"
```

## Outputs

<!-- prettier-ignore-start -->
| Name      | Description                      | Example |
|-----------|----------------------------------|---------|
| installed | Whether LCI was installed or not | `true`  |
<!-- prettier-ignore-end -->

## Example usage

Let's try to run `hello-world.lc` file with the following content:

```cobol
HAI 1.3
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
      - uses: actions/checkout@v4
      - uses: fabasoad/setup-lolcode-action@v1
      - name: Run script
        run: lci ./hello-world.lc
```

### Result

```text
Run lci ./hello-world.lc
Hello World!
```

## Contributions

![Alt](https://repobeats.axiom.co/api/embed/9b6c378bb5c49b5d03f785f2db871e5cd96e46f6.svg "Repobeats analytics image")
