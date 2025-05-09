## environment

- **[nvm](https://github.com/nvm-sh/nvm)** to manage node versions.

```bash
brew install nvm
```

- install node version

```bash
nvm install
```

## development setup

- create a fork of the repo, clone that, and install the things

```bash
npm ci
```

- configure your environment

```bash
npm run cli -- init-env
```

- extract and build your site

```bash
npm run cli -- extract-site <spaceKey>
npm run cli -- build-site --dev
```

- or test with local content

```bash
npm run cli -- build-site --assets ./assets --dest local --dev
```

## house-keeping

- build it

```bash
npm run build
```

- format it

```bash
npm run  format
```

- lint it

```bash
npm run lint
npm run lint --fix
```

- test it

```bash
npm run wdio
```
