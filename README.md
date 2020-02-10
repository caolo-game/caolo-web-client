[![CircleCI](https://circleci.com/gh/snorrwe/caolo-web-client/tree/master.svg?style=svg)](https://circleci.com/gh/snorrwe/caolo-web-client/tree/master)

## Demo

[Demo](https://caolo-game.github.io/caolo-web-client/)

## Prerequisites

-   [NodeJS V10](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com/lang/en/)
-   [Rust+WASM](https://rustwasm.github.io/book/game-of-life/setup.html)

## Building and running

-   Init
    ```
    git submodule init
    git submodule update
    make build-math
    yarn install
    ```
-   Run
    ```
    yarn start
    ```

Prettier issue:
Remove 'prettier.eslintIntegration' from prettier config or prettier can crash on react hooks.
