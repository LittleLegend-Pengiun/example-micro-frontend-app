# LHA-HDT MiniApp Generator

A CLI tool to generate micro-frontend applications using Webpack Module Federation.

## Installation

```bash
npm install -g lha-hdt-miniapp-generator
```

## Usage

After installation, you can generate a new micro-frontend app by running:

```bash
lha-hdt-miniapp-generator
```

The tool will prompt you for:
- App name (default: mini_app_example)
  - ⚠️ **Important**: Use underscores (_) instead of hyphens (-) in the app name
  - This is a requirement of Webpack Module Federation
  - Example: `product_app`, `cart_app`, `user_app`
- Expose key (default: mount)
- Expose value (default: ./bootstrap)
- Port number (default: 3000)

## Features

- Generates a complete micro-frontend application structure
- Configures Webpack Module Federation
- Sets up unique mounting points for each app
- Includes React setup with proper dependencies
- Configures development server

## Generated App Structure

```
your_app_name/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   └── components/
├── webpack/
│   └── webpack.config.js
├── bootstrap.jsx
├── index.jsx
├── package.json
└── .babelrc
```

## Importing Micro-Frontends

To import another micro-frontend into your application, use the `EmbededMicroFrontEnd` component:

```jsx
import EmbededMicroFrontEnd from "./helpers/EmbededMicroFrontEnd";

// Inside your component:
<EmbededMicroFrontEnd
  remoteUrl="http://localhost:3001/remoteEntry.js"  // URL to the remote app's entry point
  scope="remote_app_name"                           // Name of the remote app (must match its package.json name)
  module="./mount"                                  // The exposed module path from the remote app
/>
```

### Parameters Explained:

1. `remoteUrl`: The URL to the remote app's entry point
   - Format: `http://localhost:<port>/remoteEntry.js`
   - This is the URL where the remote app is serving its Module Federation bundle

2. `scope`: The name of the remote app
   - Must match the `name` field in the remote app's package.json
   - ⚠️ **Important**: Use underscores (_) instead of hyphens (-) in the app name
   - This is a requirement of Webpack Module Federation
   - Example: `product_app`, `cart_app`, `user_app`

3. `module`: The exposed module path
   - Must match the `exposes` key in the remote app's webpack.config.js
   - This is the entry point you want to import from the remote app

### Example:

If you have two apps:
- App A (port 3000) wants to import App B (port 3001)
- App B's package.json name is "product_app" (using underscore)
- App B exposes "./mount" in its webpack.config.js

In App A's component:
```jsx
<EmbededMicroFrontEnd
  remoteUrl="http://localhost:3001/remoteEntry.js"
  scope="product_app"
  module="./mount"
/>
```

## Getting Started with Generated App

```bash
cd your_app_name
npm install
npm start
```

## License

ISC 