# 📱 Face Analysis App

## 🤖 Features
- Real-time face detection using device camera
- Local processing (no data sent to servers)
- Fun scoring system based on facial metrics
- Firebase ad integration
- Privacy-focused design

## 🛠️ Installation
1. Install Expo CLI:
```
npm install --global expo-cli
```
2. Clone repository
3. Install dependencies:
```
npm install
```
4. Start development server:
```
npx expo start
```

## 📸 Usage
1. Grant camera permissions
2. Position face in frame
3. Get instant analysis:
   - Face symmetry score
   - Landmark detection
   - Expression metrics

## 🔥 Firebase Setup
1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Update `app.json`:
```json
{
  "expo": {
    "plugins": [
      ["expo-ads-admob", {
        "userTrackingPermission": "Allow tracking for personalized ads"
      }]
    ]
  }
}
```

## 🤔 Troubleshooting
- Camera not working: Check device permissions
- Blurry analysis: Ensure good lighting
- Ad issues: Verify Firebase configuration

📄 See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for data handling details