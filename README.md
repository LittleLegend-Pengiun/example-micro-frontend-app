
# 🌐 Example Micro Frontend App Generator

This repository provides a **CLI tool and templates** to generate micro frontend applications using **React**, **Vue**, or **Angular** — ready for integration with a container app via **Webpack Module Federation**.

> ⚠️ **Note:** This repository **does not include any example micro frontends or a host container app** — it only scaffolds new microfrontend projects using framework-specific templates.

---

## 📁 Project Structure

```
example-micro-frontend-app/
├── cli/                # CLI script to generate a new MFE
│   └── bin/
|   |   └── generate-mini-app.js
├── template/           # Boilerplate templates for each framework
│   ├── react/
│   ├── vue/
│   └── angular/
├── package.json
└── README.md
```

---

## 🚀 Generate a new microfrontend

```bash
npm run generate-microfrontend-app
```

Follow the prompts to:

* Enter a name for your microfrontend
* Choose a framework: React, Vue, or Angular

This will scaffold a new project folder based on the selected template.

---

## 🧰 What's Included in Each Template

### Overview

Each framework template includes:

* A minimal project setup (React 19, Vue 3, or Angular 19)
* Webpack 5 + Module Federation configured to expose a module
* Development and build scripts

These templates are designed to run as both standalone and integrated into another MFE.

### React/Vue template

Each template includes:

* Webpack 5 with Module Federation setup
* An exposed `mount` function for remote mounting
* A basic component (`App`) to render


#### 📁 Structure

The template looks nearly the same as a blank SPA.

```
template/react/
├── src/                    # Contain app source code
├── helpers/                # Helper functions and components to import and communicate with other MFEs
├── webpack/
|   └── webpack.config.js   # Config for ModuleFederation
├── public/
|   └── index.html          # Starting point
├── .babelrc
├── index.jsx
└── bootstrap.jsx
```

#### 🔧 Module Federation

```js
// webpack.config.js (React)
  plugins: [
    new ModuleFederationPlugin({
      name: "appName",
      remotes: {}, // dynamic loading, so leave this empty
      filename: "remoteEntry.js",
      exposes: {
        "./mount": "./bootstrap"
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
```

#### 🧪 Integrate other MFE

```jsx
<EmbededMicroFrontEnd
  remoteUrl="http://localhost:3001/remoteEntry.js"
  scope="appName"
  module="./mount"
/>
```
To render other microfrontend, you can leverage `EmbededMicroFrontEnd` built-in component, which required 3 parameters:
- `remoteUrl`: the child app URL (`http://localhost:3001`) + ModuleFederation file name (`remoteEntry.js`).
- `scope`: the scope to load all the content of the child app, which is ModuleFederation app name (`appName`).
- `module`: the exposed entry point of `bootstrap`, comes from `ModuleFederationPlugin.exposes` (`./mount`)

#### 🔄 Communication Between MFEs

Use the `CustomEvent` API for framework-agnostic event communication:

##### 1. Emit an event (from React or Vue)

```js
const data = { msg: 'Hello from React!' };
const event = new CustomEvent('shared-message', { detail: data });
window.dispatchEvent(event);
```

##### 2. Listen to event (in any MFE)

```js
window.addEventListener('shared-message', (event) => {
  console.log('Received message:', event.detail);
});
```

---
### Angular template

The Angular template includes:

* Angular 19 with Module Federation setup via `@angular-architects/module-federation`
* An exposed `mount` function for remote mounting
* A microfrontend loader library for integrating other MFEs
* Custom elements support for seamless integration

#### 📁 Structure

```
template/angular/
├── src/                        # Main application source code
│   ├── app/                    # Angular app module and components
│   ├── bootstrap.ts            # Module Federation bootstrap entry point
│   └── main.ts                 # Application entry point
├── projects/
│   └── microfrontend-loader/   # Library for loading other MFEs
│       └── src/lib/
│           ├── components/
│           │   └── embedded-microfrontend/
│           └── services/
├── webpack/
│   └── webpack.config.js       # Module Federation configuration
├── public/
│   └── index.html             # Starting point
└── angular.json               # Angular CLI configuration
```

#### 🔧 Module Federation

```js
// webpack.config.js (Angular)
module.exports = withModuleFederationPlugin({
  name: "angularApp",
  filename: "remoteEntry.js",
  remotes: {},
  exposes: {
    "./mount": "./src/bootstrap.ts",
  },
  shared: share({
    "@angular/core": { requiredVersion: "auto" },
    "@angular/common": { requiredVersion: "auto" },
    "@angular/router": { requiredVersion: "auto" },
    rxjs: { requiredVersion: "auto" },
  }),
});
```

#### 🧪 Integrate other MFE

Importing React/Vue
```html
<app-embedded-microfrontend
  remoteUrl="http://localhost:3001/remoteEntry.js"
  scope="appName"
  module="./mount">
</app-embedded-microfrontend>
```
Importing Angular
```html
<app-embedded-microfrontend
  remoteUrl="http://localhost:4201/remoteEntry.js"
  scope="does-not-matter"
  module="./mount"
  type="module"  >
</app-embedded-microfrontend>
```

To render other microfrontends, use the `EmbeddedMicrofrontendComponent` from the microfrontend-loader library, which requires 3 parameters:
- `remoteUrl`: the child app URL (`http://localhost:3001`) + ModuleFederation file name (`remoteEntry.js`)
- `scope`: the scope to load all the content of the child app, which is ModuleFederation app name (`appName`)
- `module`: the exposed entry point of `bootstrap`, comes from `ModuleFederationPlugin.exposes` (`./mount`)
- `type`: passed 'module' value incase of importing an ESModule entry points, else just leave empty.

#### 🔄 Communication Between MFEs

Use the `CustomEvent` API for framework-agnostic event communication:

##### Listen to events (in Angular MFE)

```typescript
// In your Angular component
ngOnInit() {
  window.addEventListener('shared-message', (event: any) => {
    console.log('Received message:', event.detail);
    // Handle the received data
    this.handleSharedMessage(event.detail);
  });
}

ngOnDestroy() {
  // Clean up event listeners
  window.removeEventListener('shared-message', this.handleSharedMessage);
}
```

---

## 🔗 Integration Notes

* These microfrontend templates expose an entry point (`mount` function) via **Module Federation**.
* Communication between MFEs can be done via `CustomEvent`.
