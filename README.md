
# 🌐 Example Micro Frontend App Generator

This repository provides a **CLI tool and templates** to generate micro frontend applications using **React**, **Vue**, or **Angular** — ready for integration with a container app via **Webpack Module Federation**.

> ⚠️ **Note:** This repository **does not include any example micro frontends or a host container app** — it only scaffolds new microfrontend projects using framework-specific templates.

---

## 📁 Project Structure

```
example-micro-frontend-app/
├── cli/                # CLI script to generate a new MFE
│   └── create.mfe.js
├── template/           # Boilerplate templates for each framework
│   ├── react/
│   ├── vue/
│   └── angular/
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Generate a new microfrontend

```bash
node cli/create.mfe.js
```

Follow the prompts to:

* Enter a name for your microfrontend
* Choose a framework: React, Vue, or Angular

This will scaffold a new project folder based on the selected template.

---

## 🧰 What’s Included in Each Template

Each framework template includes:

* A minimal project setup (React, Vue 3, or Angular)
* Webpack 5 + Module Federation configured to expose a module
* Development and build scripts
* A basic UI component for testing integration

These templates are designed to be dropped into a larger microfrontend system, such as one with a host container (not included here).

---

## 🔗 Integration Notes

* These microfrontend templates expose an entry point (`mount` function or component) via **Module Federation**.
* You can load them dynamically into a container app using Webpack’s remote module loading.
* Communication between MFEs can be done via `CustomEvent` or shared state libraries.
