# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

MCH Scanner is a **iOS-only** React Native + Expo app that uses iPhone LiDAR (via Apple's RoomPlan API) to scan a room and send the dimensions to the MCH (MyClubHaus) platform for golf simulator room planning. It is a companion to the [mch-agent-platform](https://github.com/slay-mch/mch-agent-platform) backend.

- **Bundle ID**: `co.myclubhaus.scanner`
- **Apple Team**: `6Q2HU64675`
- **Min deployment**: iOS 17.0, requires iPhone 12 Pro+ (LiDAR)
- **No Android support** — guard any iOS-specific code with `Platform.OS !== 'ios'` checks

## Build Commands

There is no local Xcode build. All builds run in the EAS cloud.

```bash
# Install EAS CLI (one-time)
npm install -g eas-cli

# Log in and initialize (one-time per machine)
eas login
eas init

# TestFlight / internal distribution build
eas build --platform ios --profile preview

# App Store production build
eas build --platform ios --profile production

# Submit to App Store (after a production build)
eas submit --platform ios --profile production
```

The `preview` profile uses internal distribution (no App Store review). The `production` profile targets the App Store (`ascAppId: 6762568371`).

There are no automated tests in this project.

## Architecture

### App entry flow

`App.tsx` is the root. On startup it reads `hasSeenOnboarding` from AsyncStorage:
- First launch → renders `OnboardingScreen` (3-slide intro). On finish, sets the flag and re-renders the main navigator.
- Subsequent launches → renders `NavigationContainer` with a native stack: **Scan → Results**.

`AppNavigator.tsx` (`src/navigation/`) exports the `RootStackParamList` type but is **not used** — the navigator is defined inline in `App.tsx`.

### Screen flow

| Screen | File | Purpose |
|---|---|---|
| Scan | `src/screens/ScanScreen.tsx` | Entry point. Calls `RoomPlanModule.startScan()`, listens for `onScanComplete` / `onScanError` events, navigates to Results with `dimensions`. |
| Results | `src/screens/ResultsScreen.tsx` | Shows 2D floor plan and 3D wireframe tabs, stat chips, POSTs to Vercel `/api/room-scan`, deep-links to the MCH quiz. |
| Onboarding | `src/screens/OnboardingScreen.tsx` | One-time 3-slide carousel, horizontally paginated `ScrollView` with manual scroll control. |

### Native module: `modules/room-plan/`

This is a **hand-rolled React Native native module** (not an Expo module). It bypasses Expo autolinking — `plugins/withRoomPlan.js` injects `pod 'RoomPlanNative'` directly into the Podfile after `use_expo_modules!`.

**JS side** (`index.ts`): Wraps `NativeModules.RoomPlanNative`. Returns `null` if the module isn't registered (non-iOS or dev simulator without LiDAR). Exposes `startScan()` and `addListener(event, callback)`.

**Native bridge** (`ios/RoomPlanNative.m`): Objective-C `RCTEventEmitter` that:
1. Checks/requests camera permission via `AVFoundation`
2. Presents `MCHRoomScannerViewController` full-screen (modal)
3. Implements `RoomPlanDelegate` to fire `onScanComplete` or `onScanError` events back to JS

**Scanner VC** (`ios/MCHRoomScannerViewController.swift`): Full-screen Apple `RoomCaptureView`. On session end, uses `RoomBuilder` to extract dimensions from walls/floors (meters → feet, 1 decimal place), exports a `.usdz` to the temp directory, then calls the delegate. Falls back to `10×12×9 ft` if `RoomBuilder` throws.

**3D view** (`ios/MCHRoom3DView.swift` + `ios/MCHRoom3DViewManager.m`): A `UIView` backed by `SCNView` (SceneKit). Renders a wireframe room box with orbit gesture. Exposed to React Native as `MCHRoom3DView` via `RCTViewManager`.

**Events emitted by the native module:**
- `onScanComplete` — payload: `{ widthFt, lengthFt, heightFt, usdzPath? }`
- `onScanError` — payload: `{ message }` — known values: `"cancelled"`, `"camera_denied"`, `"scan_not_started"`, `"lidar_unavailable"`, or a localized error string

### Components

- `FloorPlanSVG` (`src/components/FloorPlanSVG.tsx`): SVG 2D top-down floor plan using `react-native-svg`. Draws room outline with a 2 ft grid, dimension lines with tick marks, and a compass indicator.
- `Room3DView` (`src/components/Room3DView.tsx`): Thin wrapper around the `MCHRoom3DView` native view.
- `MCHHeader` (`src/components/MCHHeader.tsx`): Shared header component.

### Backend integration

`ResultsScreen` POSTs to `https://mch-agent-platform.vercel.app/api/room-scan` as `multipart/form-data` with `width_ft`, `length_ft`, `height_ft`, and optionally the `.usdz` file. On success it receives a `scan_id` and opens a deep link to the MCH quiz pre-filled with dimensions.

## Design tokens

All screens use a consistent dark green palette — hardcode these values rather than creating a theme system:

| Token | Value |
|---|---|
| Background | `#0f1f14` |
| Card/surface | `#111f16` |
| Border | `#1f3a26` |
| Brand green | `#4ade80` |
| Muted text | `#6b7280` |
| Body text | `#9ca3af` |
| Onboarding bg | `#0f3d2a` |

## MCH Platform Rules

These rules apply across all MCH repositories (scanner, agent platform, any future services):

- **Airtable updates**: Always use `PATCH`, never `PUT`. `PUT` overwrites all fields; `PATCH` updates only the specified fields.
- **No affiliate/commission language**: Never include affiliate, referral commission, or revenue-share language in any customer-facing UI, copy, or labels — not even as placeholder text.
- **API key storage**: All API keys must be stored as Vercel environment variables only. No `.env` files committed, no keys in code, no keys in `app.json`/`eas.json`.
  - Anthropic API key env var name: `ANTHROPIC_API_KEY`
- **Recommendation scoring weights**:
  - Budget fit: **30%**
  - Skill-weighted community rating: **35%**
  - Software match: **20%**
  - Goal alignment: **15%**
- **Hard room dimension filtering runs before scoring**: Eliminate simulators that don't physically fit the room first, then apply the weighted scoring to the remaining candidates. Never score a unit that failed the dimension filter.

## Key constraints

- **No local iOS builds** — changes to native Swift/ObjC code only take effect after an EAS cloud build (`eas build --platform ios --profile preview`).
- **RoomPlan requires iOS 17** — any new API usage inside `MCHRoomScannerViewController.swift` that is version-gated should use `if #available(iOS 17.0, *)`.
- The `room-plan` module is **not** in the Expo autolinking registry. If you add new native files, update `RoomPlanNative.podspec` (`s.source_files`) accordingly.
- `AppNavigator.tsx` is unused dead code — the navigator lives in `App.tsx`. Don't create a second `NavigationContainer`.
