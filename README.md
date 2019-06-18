# uRepairPC - Websocket

<p align="center">
    <a href="https://github.com/uRepairPC">
        <img width="500" src="https://raw.githubusercontent.com/uRepairPC/docs/master/public/logo-left-icon.png" alt="uRepairPC">
    </a>
</p>
<p align="center">
    Accounting system for orders for the repair of technical means.
</p>

<p align="center">
    <a href="https://circleci.com/gh/uRepairPC/websocket" rel="nofollow"><img src="https://circleci.com/gh/uRepairPC/websocket.svg?style=shield" alt="Build Status"></a>
    <a href="https://github.com/uRepairPC/websocket" rel="nofollow"><img src="https://img.shields.io/github/package-json/v/urepairpc/websocket.svg" alt="Version"></a>
    <a href="https://codecov.io/gh/uRepairPC/websocket" rel="nofollow"><img src="https://codecov.io/gh/uRepairPC/websocket/branch/master/graph/badge.svg" alt="Test Coverage"></a>
    <a href="https://david-dm.org/uRepairPC/websocket" rel="nofollow"><img src="https://david-dm.org/uRepairPC/websocket.svg" alt="Dependency Status"></a>
    <a href="https://david-dm.org/uRepairPC/websocket?type=dev" rel="nofollow"><img src="https://david-dm.org/uRepairPC/websocket/dev-status.svg" alt="devDependency Status"></a>
    <a href="https://github.com/uRepairPC/websocket" rel="nofollow"><img src="https://img.shields.io/github/license/urepairpc/websocket.svg" alt="License"></a>
</p>

## Introducing
For realtime updates. Listen to events from the server using Redis and send to users.

## Docs
See [here](https://docs.urepairpc.com/)

## Quick Start
```bash
# Copy .env.example to .env and config this

# Install dependencies
$ npm ci

# Run on production - build project and run from dist folder
$ npm run build
$ npm run prod

# Run on development
$ npm run dev

# Run eslint
$ npm run lint

# Run test
$ npm run test
$ npm run test:coverage
```

## Ecosystem
| Project | Status | Description |
|---------|--------|-------------|
| [urepairpc-server]    | ![urepairpc-server-status]    | Backend on Laravel |
| [urepairpc-web]       | ![urepairpc-web-status]       | Frontend on Vue |
| [urepairpc-websocket] | ![urepairpc-websocket-status] | WebSocket Backend |

[urepairpc-server]: https://github.com/uRepairPC/server
[urepairpc-server-status]: https://img.shields.io/github/package-json/v/urepairpc/server.svg

[urepairpc-web]: https://github.com/uRepairPC/web
[urepairpc-web-status]: https://img.shields.io/github/package-json/v/urepairpc/web.svg

[urepairpc-websocket]: https://github.com/uRepairPC/websocket
[urepairpc-websocket-status]: https://img.shields.io/github/package-json/v/urepairpc/websocket.svg

## Changelog
Detailed changes for each release are documented in the [CHANGELOG.md](https://github.com/uRepairPC/websocket/blob/master/CHANGELOG.md).

## License
[MIT](https://opensource.org/licenses/MIT)
