# Vue 2 E-Commerce & Admin Workshop

Welcome to the **Vue E-Commerce & Admin Workshop**! This project is a comprehensive full-stack frontend application built with **Vue 2** and **Vuetify 2**. It serves a dual purpose: a customer-facing E-Commerce storefront and an Administrator Control Panel. 

This repository was designed to demonstrate modern Vue 2 application patterns, including state management, routing, component-based architecture, and integration with RESTful APIs.

---

## 🚀 Key Features

### 🛒 Storefront (Customer Facing)
- **Product Catalog & Categories:** Browse products dynamically fetched from the API.
- **Shopping Cart:** Add, remove, and update quantities of items.
- **User Authentication:** Registration, Login, and session management using JWT/Tokens.
- **Order History:** Customers can view their past orders and track statuses.

### 🛡️ Admin Panel (Management)
- **Dashboard:** Visualize sales and data using **ApexCharts**.
- **User Management:** View, add, edit, and delete system users.
- **Product Management:** Complete CRUD operations for the product catalog.
- **Order Management:** View incoming orders and update order fulfillment statuses.

---

## 🛠️ Technology Stack

The project relies on a robust set of tools and libraries in the Vue ecosystem:

- **Framework:** [Vue.js](https://v2.vuejs.org/) (v2.6)
- **UI Component Library:** [Vuetify](https://vuetifyjs.com/en/) (v2.6) - Material Design standard.
- **State Management:** [Vuex](https://vuex.vuejs.org/v3/) (v3.6)
- **Routing:** [Vue Router](https://v3.router.vuejs.org/) (v3.5)
- **HTTP Client:** [Axios](https://axios-http.com/) - Centralized API calls and interceptors.
- **Alerts & Popups:** [SweetAlert2](https://sweetalert2.github.io/)
- **Charts:** [ApexCharts (vue-apexcharts)](https://apexcharts.com/docs/vue-charts/) - For Admin Data Visualization.
- **PWA Support:** Configured for Progressive Web App capabilities via `@vue/cli-plugin-pwa`.

---

## 📂 Project Structure

```text
src/
├── api/                  # Axios instances and interceptors
├── assets/               # Static assets like images and global styles
├── components/           # Reusable UI components (ProductCard, CardImg, etc.)
├── layouts/              # Structural layouts (e.g., MainLayout for general pages)
├── plugins/              # Plugin initialization (Vuetify configuration)
├── router/               # Vue Router configuration and route guards
├── services/             # Dedicated API service modules (auth, user, product, order)
├── store/                # Vuex store configuration (state, mutations, actions, getters)
├── views/                # Page-level components (Home, Login, Admin views, etc.)
├── App.vue               # Root application component
└── main.js               # Application entry point
```

---

## 💻 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v14+ recommended) and `npm` installed.

### 1. Clone the repository
```bash
git clone https://github.com/9lut/Workshop_VueV2.git
cd Workshop_VueV2
```

### 2. Install Dependencies
```bash
npm install
```
*(This will install all required packages listed in `package.json`)*

### 3. Run the Development Server
```bash
npm run serve
```
The app will compile with hot-reload and typically run on `http://localhost:8080/`.

---

## 📦 Build & Deployment

When you are ready to deploy the application to a production environment (like Vercel, Netlify, or Nginx):

### Compile and Minify for Production
```bash
npm run build
```
This generates an optimized and minified build inside the `dist/` directory, ready to be served by any static file server.

---

## 🔧 Linting and Formatting

To maintain code quality and consistent styling, the project uses ESLint. 
Run the following command to automatically detect and fix linting errors:

```bash
npm run lint
```

---

## 📚 Further Documentation

For more detailed information on configuring and customizing this project template, please consult the [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).
