# citizens-api

let's the party begin !

### Visual studio code :

Liste des plugins  
* Typescript hero
* Move Ts
* TSlint

### .vscode
````json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug api",
            "program": "${workspaceFolder}/build/api/server.js",
            "stopOnEntry": false,
            "args": [],
            "cwd": "${workspaceFolder}",
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
