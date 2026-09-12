# AgriQueue - Technology Stack Documentation

### ⚡ Quick Stack Summary

* **Frontend:** React, Tailwind CSS, Vite, React Router, Recharts, Lucide Icons, i18next, Socket.IO Client, Axios
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.IO, JWT, Bcrypt.js, Dotenv

---

## 🏗️ Architecture Overview

AgriQueue is built using a modern **MERN (MongoDB, Express.js, React, Node.js)** architecture, enhanced with **Real-Time WebSockets** for instant queue updates, notifications, and status tracking.

```
       +-------------------------------------------------------+
       |               React 18 Frontend (Vite)                |
       |  Tailwind CSS | Recharts | Lucide | i18next | Axios   |
       +---------------------------+---------------------------+
                                   |
                  HTTP REST API / WebSockets (Socket.IO)
                                   |
       +---------------------------v---------------------------+
       |               Node.js + Express.js Backend            |
       |      JWT Auth | BcryptJS | Socket.IO Server | Mongoose|
       +---------------------------+---------------------------+
                                   |
                                Mongoose ODM
                                   |
       +---------------------------v---------------------------+
       |                   MongoDB Database                    |
       |   Users, Centres, Bookings, Queues, Slots, Payments   |
       +-------------------------------------------------------+
```

---

## 🎨 Frontend Stack

| Category | Technology / Library | Version | Description / Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | [React](https://react.dev/) | `^18.3.1` | UI Library for building interactive user interfaces |
| **Build Tool & Dev Server** | [Vite](https://vitejs.dev/) | `^5.2.11` | Ultra-fast frontend build tool and module bundler |
| **Routing** | [React Router DOM](https://reactrouter.com/) | `^6.23.1` | Client-side routing & navigation |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^3.4.3` | Utility-first CSS framework for responsive design |
| **CSS Processing** | [PostCSS](https://postcss.org/) & [Autoprefixer](https://github.com/postcss/autoprefixer) | `^8.4.38` / `^10.4.19` | CSS transformations and vendor prefixing |
| **Real-Time Communication** | [Socket.IO Client](https://socket.io/) | `^4.7.5` | WebSocket client for live queue and notification updates |
| **HTTP Client** | [Axios](https://axios-http.com/) | `^1.7.2` | Promise-based HTTP client for API integration |
| **Data Visualization** | [Recharts](https://recharts.org/) | `^3.10.1` | Composable chart library for analytical dashboards |
| **Iconography** | [Lucide React](https://lucide.dev/) | `^0.395.0` | Modern, clean icon library |
| **Internationalization (i18n)** | [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/) | `^23.11.5` / `^14.1.2` | Multi-language support (English, Hindi, regional dialects) |
| **Language Detection** | `i18next-browser-languagedetector` | `^8.0.0` | Automatic browser language detection |

---

## ⚙️ Backend Stack

| Category | Technology / Library | Version | Description / Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime Environment** | [Node.js](https://nodejs.org/) | `>=18` (ES Modules) | Server-side JavaScript runtime engine |
| **Web Framework** | [Express.js](https://expressjs.com/) | `^4.19.2` | Fast, unopinionated web framework for Node.js REST APIs |
| **Database ODM** | [Mongoose](https://mongoosejs.com/) | `^8.4.1` | MongoDB object modeling tool for schema validation and queries |
| **Real-Time Engine** | [Socket.IO](https://socket.io/) | `^4.7.5` | Real-time bidirectional event-based communication server |
| **Authentication** | [JSON Web Token (JWT)](https://jwt.io/) | `^9.0.2` | Secure, stateless authentication token generation and verification |
| **Password Hashing** | [BcryptJS](https://github.com/dcodeIO/bcrypt.js) | `^2.4.3` | Password hashing for secure user credential storage |
| **CORS Handling** | [CORS](https://github.com/expressjs/cors) | `^2.8.5` | Middleware to enable Cross-Origin Resource Sharing |
| **Environment Management** | [dotenv](https://github.com/motdotla/dotenv) | `^16.4.5` | Loads environment variables from `.env` file |

---

## 🗄️ Database & Data Models

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Database Management System** | **MongoDB** | Document-oriented NoSQL database |
| **Data Schemas / Models** | `Mongoose Schemas` | • `User` (Farmers, Center Managers, Admins)<br>• `Centre` (Procurement Centers & Capacities)<br>• `ProcurementBooking` & `ProcurementRecord`<br>• `Queue` (Live token queue status)<br>• `Slot` (Time slots for scheduling)<br>• `PaymentRecord`<br>• `Notification` |

---

## 🛠️ Tooling & Development

* **Package Manager:** `npm`
* **Development Backend:** Node.js native watcher (`node --watch server.js`)
* **Development Frontend:** `vite` (Hot Module Replacement / HMR)
* **Database Seeding:** `npm run seed` (`node seed.js`)
* **Linting:** `ESLint`

---

## 🔑 Key Architectural Features

1. **Role-Based Access Control (RBAC):** Distinct roles and UI dashboards for Admins, Center Managers, and Farmers.
2. **Real-Time Token & Queue Updates:** Instant WebSocket broadcasting when tokens advance or queue positions change.
3. **Multi-Language UI (i18n):** Multi-lingual interface tailored for farmers and procurement staff across regions.
4. **Analytical Dashboards:** Interactive charts rendering procurement metrics, queue throughput, and center status using Recharts.
