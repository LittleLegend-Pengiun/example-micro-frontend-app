# 3xMF MiniApp Generator

**Multi-Framework Micro-Frontend Module Federation CLI Tool**

A comprehensive CLI tool to generate micro-frontend applications using Webpack Module Federation for React, Vue, and Angular frameworks.

## Installation

```bash
npm install -g 3xmf-miniapp-generator
```

## Usage

After installation, you can generate a new micro-frontend app by running:

```bash
3xmf-miniapp-generator
```

The tool will prompt you for:
- **Framework**: Choose between React, Vue, or Angular
- **App name** (default: mini_app_example)
  - ⚠️ **Important**: Use underscores (_) instead of hyphens (-) in the app name
  - This is a requirement of Webpack Module Federation
  - Example: `product_app`, `cart_app`, `user_app`
- **Expose key** (default: mount)
- **Expose value** (default: ./bootstrap for React/Vue, for Angular since the under-the-hood webpack-module-federation demands each Angular app's expose value must be unique for 2 Angular importing each other easily, the generator will autogenerate an expose value for you, just click enter to proceed)
- **Port number** (default: 3000 for React, 8080 for Vue, 4200 for Angular)

## Supported Frameworks

### 🔵 React Applications
- Modern React 18+ setup
- Webpack Module Federation configuration
- Event-based cross-framework communication
- Hot module replacement for development

### 🔷 Vue Applications  
- Vue 3 Composition API
- Webpack Module Federation integration
- Custom event system for microfrontend communication
- Development server with hot reload

### 🔺 Angular Applications
- Angular 19+ with standalone components support
- Module Federation via Angular libraries
- Custom event-based communication system
- Angular CLI integration

## Generated App Structure

### React App Structure
```
your_react_app/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── EventComponent.jsx
│   └── components/
├── helpers/
│   ├── EmbededMicroFrontEnd.jsx
│   ├── eventManager.js
│   └── loadRemoteModule.js
├── webpack/
│   └── webpack.config.js
├── bootstrap.jsx
├── index.jsx
└── package.json
```

### Vue App Structure
```
your_vue_app/
├── public/
│   └── index.html
├── src/
│   ├── App.vue
│   └── EventComponent.vue
├── helpers/
│   ├── EmbededMicroFrontEnd.vue
│   ├── eventManager.js
│   └── loadRemoteModule.js
├── webpack/
│   └── webpack.config.js
├── bootstrap.js
├── index.js
└── package.json
```

### Angular App Structure
```
your_angular_app/
├── projects/
│   ├── microfrontend-loader/
│   │   └── src/lib/
│   │       ├── components/embedded-microfrontend/
│   │       └── services/remote-loader.service.ts
│   └── event-component/
│       └── src/lib/
│           ├── event-component.component.ts
│           └── event-component.module.ts
├── src/
│   └── app/
├── webpack/
│   └── webpack.config.js
└── angular.json
```

## Cross-Framework Communication

All generated apps include event-based communication systems that allow microfrontends from different frameworks to communicate with each other using native CustomEvent API.

### Event Types
- `reactMessage` - Events from React microfrontends
- `vueMessage` - Events from Vue microfrontends  
- `angularMessage` - Events from Angular microfrontends

### Example Communication
```javascript
// Send event from any framework
window.dispatchEvent(new CustomEvent("reactMessage", { 
  detail: "Hello from React!" 
}));

// Listen for events in any framework
window.addEventListener('vueMessage', (event) => {
  console.log('Received from Vue:', event.detail);
});
```

## Importing Micro-Frontends

### React - Using EmbededMicroFrontEnd Component

```jsx
import EmbededMicroFrontEnd from "./helpers/EmbededMicroFrontEnd";

<EmbededMicroFrontEnd
  remoteUrl="http://localhost:3001/remoteEntry.js"
  scope="remote_app_name"
  module="./mount"
/>
```

### Vue - Using EmbededMicroFrontEnd Component

```vue
<template>
  <EmbededMicroFrontEnd
    :remoteUrl="'http://localhost:8081/remoteEntry.js'"
    :scope="'remote_app_name'"
    :module="'./mount'"
  />
</template>

<script>
import EmbededMicroFrontEnd from "./helpers/EmbededMicroFrontEnd.vue";

export default {
  components: {
    EmbededMicroFrontEnd
  }
}
</script>
```

### Angular - Using app-embedded-microfrontend Component

```html
<app-embedded-microfrontend
  [remoteUrl]="'http://localhost:4201/remoteEntry.js'"
  [scope]="'remote_app_name'"
  [module]="'./mount'"
  [type]="'module'">
</app-embedded-microfrontend>
```

```typescript
// In your module
import { MicrofrontendLoaderModule } from 'microfrontend-loader';

@NgModule({
  imports: [MicrofrontendLoaderModule]
})
export class AppModule {}
```

## Cross-Framework Import Examples

### React Host importing Vue Microfrontend
```jsx
// React component importing Vue app
<EmbededMicroFrontEnd
  remoteUrl="http://localhost:8080/remoteEntry.js"
  scope="vue_product_app"
  module="./mount"
/>
```

### Vue Host importing Angular Microfrontend
```vue
<template>
  <EmbededMicroFrontEnd
    :remoteUrl="'http://localhost:4200/remoteEntry.js'"
    :scope="'angular_user_app'"
    :module="'./mount'"
  />
</template>
```

### Angular Host importing React Microfrontend
```html
<app-embedded-microfrontend
  [remoteUrl]="'http://localhost:3000/remoteEntry.js'"
  [scope]="'react_cart_app'"
  [module]="'./mount'">
</app-embedded-microfrontend>
```

## Parameters Explained

### Common Parameters for All Frameworks:

1. **`remoteUrl`**: The URL to the remote app's entry point
   - Format: `http://localhost:<port>/remoteEntry.js`
   - This is the URL where the remote app is serving its Module Federation bundle

2. **`scope`**: The name of the remote app
   - Must match the `name` field in the remote app's package.json
   - ⚠️ **Important**: Use underscores (_) instead of hyphens (-) in the app name
   - This is a requirement of Webpack Module Federation
   - Example: `product_app`, `cart_app`, `user_app`

3. **`module`**: The exposed module path
   - Must match the `exposes` key in the remote app's webpack.config.js
   - This is the entry point you want to import from the remote app
   - Default: `"./mount"`

### Angular-specific Parameters:

4. **`type`** (Angular only): The script type for loading the remote
   - Default: `'text/javascript'`
   - For ES modules: `'module'`

## Getting Started with Generated App

### React
```bash
cd your_react_app
npm install
npm start  # Runs on port 3000
```

### Vue
```bash
cd your_vue_app
npm install
npm run serve  # Runs on port 8080
```

### Angular
```bash
cd your_angular_app
npm install
ng build microfrontend-loader # Microfrontend Loader component is extracted as seperate library
ng serve  # Runs on port 4200
```

## Publish NPM

1. Change directory to this folder
2. Run command `npm login`
3. Run command `npm publish`

## Features

- **Multi-framework support**: React, Vue, and Angular
- **Webpack Module Federation**: Pre-configured for all frameworks
- **Cross-framework communication**: Event-based messaging system
- **Hot module replacement**: Development server with live reload
- **TypeScript support**: Full TypeScript configuration for Angular
- **Modern tooling**: Latest versions of each framework
- **Production ready**: Optimized build configurations

## License

ISC 