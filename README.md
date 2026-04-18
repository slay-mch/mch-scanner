# MCH Scanner

A purpose-built iOS LiDAR room scanner for the [MCH (My ClubHaus)](https://github.com/slay-mch/mch-agent-platform) platform. Point your iPhone at a room and get precise dimensions — wall lengths, ceiling height, floor area — sent directly to your MCH setup profile for golf simulator room planning.

---

## What This App Does

- **Scans rooms** using iPhone LiDAR (iPhone 12 Pro and later)
- **Measures** walls, ceiling height, and floor area automatically
- **Sends dimensions** back to your MCH platform profile
- **Requires no manual measuring** — just walk the room with your phone

**Companion app**: [mch-agent-platform](https://github.com/slay-mch/mch-agent-platform)

---

## Getting Started (4 Commands)

> **Prerequisites**: macOS with Xcode installed, an Apple Developer account, and an Expo account (free at expo.dev)

### Step 1 — Install EAS CLI (one-time setup)
```bash
npm install -g eas-cli
```

### Step 2 — Log in to Expo
```bash
eas login
```

### Step 3 — Initialize EAS project
```bash
eas init
```

> ⚠️ **Important**: After running `eas init`, copy the generated `projectId` and replace `REPLACE_WITH_EAS_PROJECT_ID` in `app.json` → `expo.extra.eas.projectId`. Then commit and push that change before building.

### Step 4 — Trigger your first TestFlight build
```bash
eas build --platform ios --profile preview
```

The cloud build takes ~15 minutes. When it finishes, EAS will email you a link to install the `.ipa` on your iPhone via TestFlight or direct install (internal distribution).

---

## What You'll See on Your Phone

When the build installs and you open **MCH Scanner**:

- Dark green background (`#0f1f14`)
- **MCH** logo in bright green at the top
- A centered scan frame with 📐 icon
- **"Ready to Scan"** title with description
- A bright green **"Start Scanning"** button
- Disclaimer: "Requires iPhone 12 Pro or later with LiDAR sensor"

The button doesn't do anything yet — actual LiDAR scanning is wired up in Session 2.

---

## Tech Stack

- **Framework**: React Native + Expo SDK 51
- **Build**: Expo EAS Build (cloud, no local Xcode build needed)
- **Language**: TypeScript
- **Navigation**: React Navigation v6 (native stack)
- **Platform**: iOS only (iPhone 12 Pro+ with LiDAR)
- **Bundle ID**: `co.myclubhaus.scanner`
- **Apple Team**: `6Q2HU64675`

---

## Session Roadmap

| Session | Goal |
|---|---|
| ✅ Session 1 | Scaffold, EAS config, TestFlight build pipeline |
| Session 2 | Live LiDAR scanning with Apple RoomPlan API |
| Session 3 | 2D floor plan as labeled SVG |
| Session 4 | SceneKit 3D orbit view |
| Session 5 | Supabase room_scans table + Vercel /api/room-scan + Vercel Blob for .usdz |
| Session 6 | Deep link + quiz auto-fill |
| Session 7 | Polish, App Store listing, screenshots, production build + submission |
