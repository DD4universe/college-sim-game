# 🎨 Quick Download Links for Textures

## Click these links to download free textures directly:

### 🧱 Brick Wall (Classrooms)
- [Download from Polyhaven](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/brick_wall_001/brick_wall_001_diff_1k.jpg)
- Alternative: [Unsplash Brick](https://unsplash.com/photos/brown-brick-wall-photo-BL0Dp61oYKw/download?force=true&w=1920)

### 🚽 White Tiles (Restrooms)
- [Download from Polyhaven](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/white_tiles/white_tiles_diff_1k.jpg)
- Alternative: [Unsplash Tiles](https://unsplash.com/photos/white-tiles-_5bFj-KdvGE/download?force=true&w=1920)

### 🪵 Wood Panels (Faculty Rooms)
- [Download from Polyhaven](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_floor_deck/wood_floor_deck_diff_1k.jpg)
- Alternative: [Unsplash Wood](https://unsplash.com/photos/brown-wooden-surface-1YKGC4UZMEU/download?force=true&w=1920)

### 🌿 Grass (Ground)
- [Download from Polyhaven](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/aerial_grass_rock/aerial_grass_rock_diff_1k.jpg)
- Alternative: [Unsplash Grass](https://unsplash.com/photos/green-grass-field-8OyKWQgBsKQ/download?force=true&w=1920)

### 🏢 Concrete (Corridors)
- [Download from Polyhaven](https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/concrete_floor_worn/concrete_floor_worn_diff_1k.jpg)
- Alternative: [Unsplash Concrete](https://unsplash.com/photos/white-concrete-building-during-daytime-cZr6Zu6hFrM/download?force=true&w=1920)

### 🚪 Wooden Door
- [Download from Unsplash](https://unsplash.com/photos/brown-wooden-door-3Wr1-b-1ik4/download?force=true&w=1920)

### 🔬 Modern Glass (Labs)
- [Download from Unsplash](https://unsplash.com/photos/white-and-blue-glass-walled-high-rise-building-rymh7EZPqRs/download?force=true&w=1920)

### 🍽️ Canteen Wall
- [Download from Unsplash](https://unsplash.com/photos/orange-red-and-yellow-painted-wall-k60JspcEzSE/download?force=true&w=1920)

### 💻 Server Room (Tech Blue)
- [Download from Unsplash](https://unsplash.com/photos/blue-and-black-audio-mixer-iar-afB0QQw/download?force=true&w=1920)

### ☁️ Sky Background
- [Download from Polyhaven](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/blue_photo_studio_1k.hdr)
- Alternative: [Unsplash Sky](https://unsplash.com/photos/white-clouds-and-blue-sky-PVgDgVmPJMc/download?force=true&w=2400)

---

## 📁 How to Use Downloaded Textures:

1. **Create texture folder**:
   ```
   cd client
   mkdir public\textures
   ```

2. **Move downloaded images** to `client/public/textures/`:
   - Rename them simply: `brick.jpg`, `tiles.jpg`, `wood.jpg`, etc.

3. **Update college.ts** to use local files:
   ```typescript
   const textureUrls = {
     classroom: '/textures/brick.jpg',
     restroom: '/textures/tiles.jpg',
     faculty: '/textures/wood.jpg',
     lab: '/textures/glass.jpg',
     canteen: '/textures/canteen.jpg',
     server: '/textures/server.jpg',
   }
   ```

4. **Test**: `npm run dev` in client folder

---

## 🎮 Character Models (Optional)

### Download Free 3D Characters:
1. **Mixamo** (Best option - with animations!)
   - Go to: https://www.mixamo.com
   - Sign in with Adobe account (free)
   - Download FBX format
   - Use THREE.FBXLoader to load

2. **Ready Player Me**
   - Go to: https://readyplayer.me
   - Create avatar from photo
   - Download GLB format
   - Use THREE.GLTFLoader

3. **Sketchfab** (Free low-poly characters)
   - https://sketchfab.com/tags/character?features=downloadable&sort_by=-likeCount
   - Filter: Downloadable + CC BY

---

## ⚡ Quick Setup Script

Run this in PowerShell to create texture folder:

```powershell
cd client
New-Item -ItemType Directory -Path "public\textures" -Force
Write-Host "Texture folder created! Download images from links above and place them here." -ForegroundColor Green
```

Then download textures from the links above and save to `client/public/textures/`!
