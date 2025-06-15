
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

## 🚀 Generate a new microfrontend

```bash
npm run generate-microfrontend-app
```

Follow the prompts to:

* Enter a name for your microfrontend
* Choose a framework: React, Vue, or Angular

This will scaffold a new project folder based on the selected template.

---

## 🧰 What’s Included in Each Template

Each framework template includes:

* A minimal project setup (React 19, Vue 3, or Angular 19)
* Webpack 5 + Module Federation configured to expose a module
* Development and build scripts

These templates are designed to run as both standalone and integrated into another MFE.

---

## 🔗 Integration Notes

* These microfrontend templates expose an entry point (`mount` function) via **Module Federation**.
* Communication between MFEs can be done via `CustomEvent`.
