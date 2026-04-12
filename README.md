![WebStray Authenticator Preview](.github/assets/authenticator.png)

# WebStray Authenticator

Secure, hardware-bound desktop password manager.
Built for privacy. Engineered for extensibility. Powered by NW.js.

## About

WebStray Authenticator is a desktop password manager built using JavaScript, React, Vite, and NW.js.

## Documentation

Detailed documentation for WebStray Authenticator is available on the [official WebStray website](https://webstray.com/docs/authenticator).

## Key Features

### Security Architecture

- **Data Encryption:** Implementation of the `AES-256-GCM` authenticated encryption algorithm for all sensitive data.
- **Hardware Binding:** Database access is cryptographically tied to a unique **machine ID**, preventing decryption on unauthorized devices even if the database file is compromised.
- **Zero-Knowledge Model:** All sensitive data is encrypted locally and never stored in plaintext. Your data never leaves your machine by default (excluding activity from third-party plugins installed by the user).
- **Secure Data Portability:** Built-in utilities for importing and exporting JSON with encryption and decryption support.

### Engineering & Extensibility

- **Extensible Plugin System:** A robust core architecture implementing **Dependency Injection (DI)** and **Inversion of Control (IoC)** patterns.
- **State Management:** Powered by **Zustand** for a lightweight, scalable, and high-performance global state.
- **Persistent Storage:** High-performance, **NeDB**-based storage engine for a reliable offline-first experience.

### Interface & UX

- **Command-Driven Navigation:** Built-in **Command Palette** for instant access to global actions via keyboard-centric workflows.
- **Modern Component Architecture:** UI layer built on **Radix UI** primitives and **shadcn/ui** for maximum accessibility and design consistency.
- **Hardware-Accelerated UI:** Fluid interface transitions and state-driven animations using **Framer Motion**.

## Built With

WebStray Authenticator leverages a modern tech stack designed for security, performance, and a native desktop experience:

### Desktop & Core

- **[NW.js](https://github.com/nwjs/nw.js/)** – A desktop runtime that allows calling Node.js modules directly from DOM.
- **[React 19](https://github.com/facebook/react)** – Declarative UI framework for building a fast and reactive user interface.
- **[Vite 7](https://github.com/vitejs/vite)** – Next-generation frontend tooling providing an ultra-fast development experience.
- **[Zustand](https://github.com/pmndrs/zustand)** – Minimalistic and scalable state management.

### UI & UX

- **[Tailwind CSS v4](https://github.com/tailwindlabs/tailwindcss)** – Utility-first CSS framework for UI styling.
- **[shadcn/ui](https://github.com/shadcn-ui/ui)** – Accessible, high-quality components built with Radix UI.
- **[Framer Motion](https://github.com/motiondivision/motion)** – Motion library for fluid interface transitions.
- **[Sonner](https://github.com/emilkowalski/sonner)** – An opinionated, lightweight toast component for real-time user feedback.

### Security & Data

- **[@seald-io/nedb](https://github.com/seald/nedb)** – Embedded persistent database for local storage.
- **[otpauth](https://github.com/hectorm/otpauth)** – Comprehensive RFC-compliant library for generating HOTP and TOTP tokens.
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** – Password hashing to ensure secure master password derivation.
- **[node-machine-id](https://github.com/automation-stack/node-machine-id)** – Unique hardware identification for cryptographic data binding.

## Installation

### Desktop Application (Windows)

You can download the WebStray Authenticator installer for Windows from the [official download page](https://github.com/webstraycom/authenticator/releases/latest).

### Manual Build (Windows, macOS, Linux)

You can build **WebStray Authenticator from source** for any supported platform using `nw-builder`.

> [!NOTE]
> The runtime is usually fetched automatically by `nw-builder`, but can also be downloaded manually from the [official NW.js website](https://nwjs.io/downloads/).

1. **Clone the repository**

```cmd
git clone https://github.com/webstraycom/authenticator.git
cd authenticator
```

2. **Install dependencies**

```cmd
npm install
```

3. **Build for your OS**

Use the following commands to create a production-ready executable:

**Windows (x64):**

```cmd
npx nw-builder . --mode=build --platform=win --arch=x64 --outDir=./dist/win
```

**macOS:**

```cmd
# Intel
npx nw-builder . --mode=build --platform=osx --arch=x64 --outDir=./dist/mac

# Apple Silicon (M1/M2/M3)
npx nw-builder . --mode=build --platform=osx --arch=arm64 --outDir=./dist/mac
```

**Linux (x64):**

```cmd
npx nw-builder . --mode=build --platform=linux --arch=x64 --outDir=./dist/linux
```

## Local Development

To run the application in development mode with **Hot Module Replacement (HMR)**, follow these steps:

1. **Start the Vite development server**

This will start the frontend with live-reloading on `localhost:5173`.

```cmd
npm run dev
```

2. **Launch the Desktop Environment**

In a **new terminal window**, run the following command to open the NW.js window:

```cmd
npm run start
```

## Security Policy

We take the security of WebStray Authenticator seriously. If you find a security vulnerability, please help us by reporting it responsibly.

### Reporting a Vulnerability

- **Standard Vulnerabilities:** For general security bugs, please [open a new Issue](https://github.com/webstraycom/authenticator/issues/new) using the **Security Report** label.
- **Critical Vulnerabilities:** If the vulnerability compromises the core encryption logic, we encourage you to provide a detailed **Proof of Concept (PoC)** in the issue description.

### Security Guarantees

- **Zero-Knowledge:** We do not have access to your master password or unencrypted database.
- **Local-First:** Your data is processed and stored exclusively on your machine.

## Disclaimer

**WebStray Authenticator is provided "as is", without warranty of any kind.**

By using this software, you acknowledge and agree that:

1. **User Responsibility:** You are solely responsible for the safety of your master password. If lost, your data cannot be recovered.
2. **Third-Party Plugins:** The use of community-made or third-party plugins is at your own risk. Plugins have the technical capability to access your decrypted data. **We are not responsible for any data leaks or security breaches caused by third-party extensions.**
3. **No Liability:** The developers shall not be held liable for any data loss, hardware damage, or security breaches resulting from the use or inability to use this software.
4. **Active Development:** This project is in beta. While we prioritize security, you use it at your own risk.

**Always audit the source code of any plugin before installation and maintain secure backups.**

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
