# citizens-api

let's the party begin !

### Prérequis

Node >=8.9.3

### Installation

```sh
npm install
```

### Démarrage serveur

Créer un fichier .env avec les variables nécessaires (voir src/api/config/index)


```sh
npm start
```

### Lancer les tests unitaires

```sh
npm test
```

### Vérifier la style du code

```sh
npm run tslint
```
### Consulter la doc API

Après le lancement du serveur se rendre sur [la page de doc swagger](localhost:3000/api-docs/#/)

### Visual studio code :

Liste des plugins
* Typescript hero
* Move Ts
* TSlint

### .vscode
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch via NPM",
            "runtimeExecutable": "npm",
            "runtimeArgs": [
                "run-script",
                "debug",
                "start"
            ],
            "port": 9229
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Debug api",
            "program": "${workspaceFolder}/build/api/server.js",
            "stopOnEntry": false,
            "runtimeArgs": [
                "--require", "dotenv/config"
            ],
            "args": [
                "--require", "dotenv/config"
            ],
            "preLaunchTask": null,
            "sourceMaps": true,
            "protocol": "inspector"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Mocha Tests",
            "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
            "protocol": "inspector",
            "args": [
                "-r",
                "ts-node/register",
                "${workspaceFolder}/tests/**/*.spec.ts"
            ],
            "internalConsoleOptions": "openOnSessionStart",
            "sourceMaps": true
        },
        {
            "type": "node",
            "request": "launch",
            "name": "node server.js",
            "program": "${workspaceFolder}/build/api/server.js"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}/src\\api\\controllers\\RootCtrl.ts",
            "preLaunchTask": "tsc: build - tsconfig.json",
            "outFiles": [
                "${workspaceFolder}/build/**/*.js"
            ]
        }
    ]
}
```

### remarque

La validation par jsonSchema me semble lente (57ms) pour valider moins d'une dizaine d'attribut
à méditer un jour ou les perfs seront à optimiser

