# Building APK for DilSayCare Mobile App

This guide explains how to build APK files for different environments.

## Prerequisites

1. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```
   - Use your Expo account credentials
   - If you don't have an account, create one at https://expo.dev

3. **Configure the project (first time only):**
   ```bash
   eas build:configure
   ```

## Build Profiles

We have 3 build profiles configured:

### 1. **Staging** (Points to dev.dilsaycare.in) ← USE THIS
```bash
yarn build:staging
```
or
```bash
eas build --profile staging --platform android
```

**Environment:**
- URL: `https://dev.dilsaycare.in`
- Build type: APK
- Distribution: Internal

### 2. **Development** (Points to local server)
```bash
yarn build:dev
```

**Environment:**
- URL: `http://192.168.29.68:5173`
- Build type: APK with development client
- Distribution: Internal

### 3. **Production** (Points to dilsaycare.in)
```bash
yarn build:prod
```

**Environment:**
- URL: `https://dilsaycare.in`
- Build type: APK
- Distribution: Store

## Step-by-Step: Build Staging APK

### Method 1: Using yarn script (Recommended)
```bash
cd /Users/trishnangshugoswami/Documents/rootman/dilsaycare/mobile-app
yarn build:staging
```

### Method 2: Using EAS CLI directly
```bash
cd /Users/trishnangshugoswami/Documents/rootman/dilsaycare/mobile-app
eas build --profile staging --platform android
```

## Build Process

1. **Command runs** → EAS CLI starts
2. **Upload code** → Code is uploaded to Expo servers
3. **Build starts** → APK is built in the cloud (takes 5-15 minutes)
4. **Download link** → You'll get a download link for the APK
5. **Install** → Download and install on Android device

## After Build Completes

You'll see output like:
```
✔ Build finished
APK: https://expo.dev/artifacts/eas/[your-build-id].apk
```

### Download APK:
- Click the link provided
- Or visit: https://expo.dev/accounts/[your-account]/projects/dilsaycare-mobile/builds

### Install on Android:
1. Download the APK to your phone
2. Enable "Install from Unknown Sources" in Android settings
3. Tap the downloaded APK to install
4. Open the app - it will load `https://dev.dilsaycare.in`

## Build for iOS

```bash
yarn build:ios:staging
```

**Note:** iOS builds require:
- Apple Developer account ($99/year)
- Certificate and provisioning profile
- More complex setup

## Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "No project ID"
First time setup:
```bash
eas build:configure
```

### Check build status
```bash
eas build:list
```

## Environment Variables

Each profile automatically sets the `WEB_URL` environment variable:
- **staging**: `https://dev.dilsaycare.in`
- **development**: `http://192.168.29.68:5173`
- **production**: `https://dilsaycare.in`

The app reads this in `app.config.js` and passes it to the WebView.

## Local vs Cloud Build

### Cloud Build (Recommended) - What we set up
- ✅ Builds on Expo servers
- ✅ No need for Android Studio/Xcode
- ✅ No local dependencies
- ✅ Consistent builds
- ⏱️ Takes 5-15 minutes

### Local Build (Not configured)
- ❌ Requires Android Studio
- ❌ Complex setup
- ❌ Local dependencies needed
- ✅ Faster if already set up

## Quick Reference

| Command | Environment | URL |
|---------|------------|-----|
| `yarn build:staging` | Staging | https://dev.dilsaycare.in |
| `yarn build:dev` | Development | http://192.168.29.68:5173 |
| `yarn build:prod` | Production | https://dilsaycare.in |

## Common Commands

```bash
# Build staging APK (most common)
yarn build:staging

# Check build status
eas build:list

# View build details
eas build:view [build-id]

# Cancel a build
eas build:cancel

# View all projects
eas whoami
```

## Support

For more information:
- EAS Build docs: https://docs.expo.dev/build/introduction/
- EAS CLI reference: https://docs.expo.dev/build-reference/eas-cli/
