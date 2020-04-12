![Node.js CI](https://github.com/caolo-game/caolo-web-client/workflows/Node.js%20CI/badge.svg?branch=master)
![Deploy](https://github.com/caolo-game/caolo-web-client/workflows/Deploy/badge.svg)

## Demo

[Demo](https://caolo-game.github.io/caolo-web-client/)

## Prerequisites

-   [NodeJS V10+](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com/lang/en/)

## Building and running

-   Init
    ```
    yarn
    ```
-   Run
    ```
    yarn start
    ```

Prettier issue:
Remove 'prettier.eslintIntegration' from prettier config or prettier can crash on react hooks.

## Testing

End-to-end testing is done via [Cypress](https://docs.cypress.io).
To run Cypress start a development server, then [in a separate shell] open Cypress.

```
yarn start
cypress open
```