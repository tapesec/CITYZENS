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

*   Typescript hero
*   Move Ts
*   TSlint

### .vscode

#### launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "build & debug",
            "preLaunchTask": "run tsc",
            "program": "${workspaceFolder}/build/api/server.js",
            "runtimeArgs": ["--require", "dotenv/config"]
        },

        {
            "type": "node",
            "request": "launch",
            "name": "debug",
            "program": "${workspaceFolder}/build/api/server.js",
            "runtimeArgs": ["--require", "dotenv/config"]
        }
    ]
}
```

#### tasks.json

```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "label": "run tsc",
            "type": "shell",
            "command": "tsc"
        }
    ]
}
```

#### paramètre vscode de dossiers pour prettier/eslint

```json
{
    "editor.formatOnSave": true,
    "tslint.exclude": "C:\\workspace\\CITYZENS\\tests\\**\\*.spec.ts"
}
```

### remarque

La validation par jsonSchema me semble lente (57ms) pour valider moins d'une dizaine d'attribut
à méditer un jour ou les perfs seront à optimiser
