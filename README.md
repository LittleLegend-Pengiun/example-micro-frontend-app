# example-micro-frontend-app

# Note for angular
Build the library module: `ng build microfrontend loader`  
Angular Webpack Module Federation export remoteEntry.js as esModule file

# Difference between 2 method of export remoteEntry.js

## CommonJS/UMD Approach (Script Tag):

```js
// CommonJS/UMD remoteEntry.js does this when executed:
window.angular = {
  init: function() { /* ... */ },
  get: function() { /* ... */ }
};

// So we need to:
// 1. Load the script
// 2. Wait for it to execute  
// 3. Access the global variable
const script = document.createElement("script");
script.src = remoteUrl;
script.onload = () => {
  const container = window[scope]; // Now available globally
  // Use container...
};
document.head.appendChild(script);
```

## ES Module Approach (Dynamic Import):
```js
// ES Module remoteEntry.js exports directly:
export const init = function() { /* ... */ };
export const get = function() { /* ... */ };

// So we can import directly:
const container = await import(remoteUrl);
// Use container directly, no global variable
```

The Key Differences:
1. Global vs Direct Access
CommonJS: Creates window[scope] global variable
ES Module: Returns exports directly
2. Execution Model
CommonJS: Script must execute to create global
ES Module: Import returns the module immediately
3. DOM Manipulation
CommonJS: Requires script tag in DOM
ES Module: No DOM manipulation needed

# When to Use Each:
- Script Tag: Webpack Module Federation (most common)
- Dynamic Import: True ES modules or webpack experiments with ES module builds