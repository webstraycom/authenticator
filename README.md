<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/og-dark.png">
  <source media="(prefers-color-scheme: light)" srcset=".github/assets/og-light.png">
  <img alt="WebStray Authenticator interface preview" src=".github/assets/og-dark.png">
</picture>

# WebStray Authenticator

Secure, hardware-bound desktop password manager.
Built for privacy. Engineered for extensibility. Completely open source.

## Documentation

Read the documentation on the [official website](https://webstray.com/docs/authenticator).

## Features

### Security

- **Data Encryption:** Sensitive data is encrypted using the `AES-256-GCM` authenticated encryption algorithm.
- **Hardware Binding:** Hardware-bound sessions are cryptographically tied to a unique machine ID, preventing them from being reused on unauthorized devices.
- **Zero-Knowledge Architecture:** Sensitive data is encrypted and processed locally and does not leave your machine by default.
- **Secure Data Portability:** Import and export JSON data with encrypted sensitive values.

### User Experience

- **Modern Interface:** Clean, minimal design with fluid transitions and subtle visual feedback.
- **Keyboard-Driven Navigation:** Command palette and keyboard shortcuts for efficient navigation and faster access to application actions.
- **Accessibility:** Designed with accessibility in mind.
- **Plugin System:** Extensible architecture for integrating additional functionality through plugins.

## Installation

### Desktop Application

Download WebStray Authenticator for Windows from [GitHub Releases](https://github.com/webstraycom/authenticator/releases/latest).

### Build from Source

Build from source for any supported platform using `nw-builder`.

1. **Clone the repository**

```bash
git clone https://github.com/webstraycom/authenticator.git
cd authenticator
```

2. **Install dependencies**

```bash
npm install
```

3. **Build for your OS**

Use the following commands to create a production-ready executable:

**Windows (x64):**

```bash
npx nw-builder . --mode=build --platform=win --arch=x64 --outDir=./dist/win
```

**macOS:**

```bash
# Intel
npx nw-builder . --mode=build --platform=osx --arch=x64 --outDir=./dist/mac

# Apple Silicon
npx nw-builder . --mode=build --platform=osx --arch=arm64 --outDir=./dist/mac
```

**Linux (x64):**

```bash
npx nw-builder . --mode=build --platform=linux --arch=x64 --outDir=./dist/linux
```

## Development

Run the application in development mode:

1. **Start the development server**

```bash
npm run dev
```

2. **Launch the desktop application**

In a new terminal, run:

```bash
npm start
```

## Security Policy

We take the security of WebStray Authenticator seriously. If you find a security vulnerability, please help us by reporting it responsibly.

- **Standard Vulnerabilities:** For general security bugs, please [open a new issue](https://github.com/webstraycom/authenticator/issues/new) using the `security report` label.
- **Critical Vulnerabilities:** Please report security issues responsibly and avoid publicly disclosing sensitive exploit details before a fix is available.

## Disclaimer

**WebStray Authenticator is provided "as is", without warranty of any kind.**

By using this software, you acknowledge and agree that:

1. **User Responsibility:** You are solely responsible for the safety of your master password. If you lose it, your data cannot be recovered.
2. **Third-Party Plugins:** The use of community-made plugins is at your own risk. Plugins have the technical capability to access your decrypted data. **We are not responsible for any data leaks or security breaches resulting from their use.**
3. **No Liability:** The developers shall not be held liable for any data loss, hardware damage, or security breaches arising from the use of or inability to use this software.
4. **Development Status:** This project is currently in beta. While we prioritize security, please use it at your own risk.

**Always audit the source code of any plugin before installation and maintain secure backups.**

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
