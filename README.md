# SDK Microfrontend Atomic Unit
## Structure
- shell: contain shell app
- miniapps: contain multiple miniapps
## Generate mini-app
```
yarn generate-miniapp
yarn
```
Update the new miniapp into importConfig.json in shell folder  
Run all necessary shell & miniapp  
```
yarn start // in shell and every miniapps folder
```
Open `http://localhost:3000`