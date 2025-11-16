# Dil Say Care Mobile App

A React Native Expo app that loads the Dil Say Care web application in a WebView.

## Prerequisites

- Node.js (v18 or higher)
- Yarn
- Expo Go app on your mobile device (for testing)

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run on specific platform
yarn ios
yarn android
```

## 📁 Project Structure

```
mobile-app/
├── src/
│   ├── components/      # React components
│   │   └── SplashScreen.tsx
│   ├── config/          # App configuration
│   │   └── environment.ts
│   ├── constants/       # App constants & colors
│   │   ├── app.ts
│   │   └── colors.ts
│   ├── hooks/          # Custom React hooks
│   │   └── useAppInitialization.ts
│   ├── services/       # Business logic & services
│   │   └── platformBridge.ts
│   ├── types/          # TypeScript type definitions
│   │   ├── platform.ts
│   │   └── webview.ts
│   └── utils/          # Utility functions
│       ├── logger.ts
│       └── webview.ts
├── assets/             # Images, fonts, etc.
├── App.tsx            # Main app component
└── app.config.js      # Expo configuration
```

## 🌍 Environment Configuration

### Available Commands

**Local Development** (with local Proton server):
```bash
yarn start:local    # Expo server
yarn ios:local      # iOS simulator
yarn android:local  # Android emulator
```

**Staging**:
```bash
yarn start:stage
yarn ios:stage
yarn android:stage
```

**Production**:
```bash
yarn start:prod
```

### Environment Variables

Set `WEB_URL` to configure the WebView:

- **Local**: `http://192.168.29.68:5173`
- **Staging**: `https://dev.dilsaycare.in` (default)
- **Production**: `https://dilsaycare.in`

## 🏗️ Architecture

### Key Features

- **WebView Integration** - Seamless integration with Proton web app
- **Platform Bridge** - Native-to-web communication via postMessage
- **Smart Logging** - Development-only logging system
- **Type Safety** - Full TypeScript support with strict mode
- **Clean Architecture** - Separation of concerns with proper structure
- **Production Ready** - Optimized for performance and maintainability

### Design Patterns

- **Custom Hooks** - Reusable logic encapsulation
- **Service Layer** - Business logic separation
- **Constants Management** - Centralized configuration
- **Type Definitions** - Strong typing throughout

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Yarn
- Expo CLI
- iOS Simulator (Mac) / Android Emulator

### Code Quality

- TypeScript strict mode enabled
- Clean code principles
- No console logs in production
- Proper error handling

## 📱 Platform Support

- ✅ iOS 13+
- ✅ Android 5.0+
- ✅ React Native 0.76.9
- ✅ Expo SDK ~52.0.0

## 🔧 Configuration

App configuration is managed in:
- `app.config.js` - Expo configuration
- `src/constants/app.ts` - App constants
- `src/config/environment.ts` - Environment settings

## 📦 Build

```bash
# Development build
eas build --profile development

# Production build
eas build --profile production
```

## 📄 License

Private - Dil Say Care proper device spacing

## Tech Stack

- React Native
- Expo SDK 52
- TypeScript
