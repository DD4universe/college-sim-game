import * as THREE from 'three'
import { CollegeBuilder } from './college.ts'

console.log('Game script loaded!')

// Remove loading indicator
const loadingEl = document.getElementById('loading')
if (loadingEl) {
  setTimeout(() => loadingEl.remove(), 1000)
}

// Setup scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87CEEB) // Sky blue
scene.fog = new THREE.Fog(0x87CEEB, 50, 200)

// Setup camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 10, 20)

// Setup renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
const container = document.getElementById('canvas-container')
if (container) {
  container.appendChild(renderer.domElement)
} else {
  document.body.appendChild(renderer.domElement)
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(50, 50, 50)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
directionalLight.shadow.camera.left = -100
directionalLight.shadow.camera.right = 100
directionalLight.shadow.camera.top = 100
directionalLight.shadow.camera.bottom = -100
scene.add(directionalLight)

// Create ground with realistic grass texture
const textureLoader = new THREE.TextureLoader()
const groundGeometry = new THREE.PlaneGeometry(200, 200)
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x228B22,
  roughness: 0.9
})

// Load grass texture
textureLoader.load(
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1024&q=80',
  (texture: THREE.Texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(50, 50)
    groundMaterial.map = texture
    groundMaterial.needsUpdate = true
  }
)

const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

// Build college
const college = new CollegeBuilder(scene)

// Create player
const playerGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8)
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const player = new THREE.Mesh(playerGeometry, playerMaterial)
player.position.set(0, 1, 10)
player.castShadow = true
scene.add(player)

// Camera follows player
camera.position.set(player.position.x, player.position.y + 5, player.position.z + 10)
camera.lookAt(player.position)

// Controls
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  ArrowUp: false,
  ArrowLeft: false,
  ArrowDown: false,
  ArrowRight: false
}

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() in keys) {
    keys[e.key.toLowerCase() as keyof typeof keys] = true
  }
  if (e.key in keys) {
    keys[e.key as keyof typeof keys] = true
  }
})

window.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() in keys) {
    keys[e.key.toLowerCase() as keyof typeof keys] = false
  }
  if (e.key in keys) {
    keys[e.key as keyof typeof keys] = false
  }
})

// Game loop
const speed = 0.2
function animate() {
  requestAnimationFrame(animate)

  // Player movement
  if (keys.w || keys.ArrowUp) player.position.z -= speed
  if (keys.s || keys.ArrowDown) player.position.z += speed
  if (keys.a || keys.ArrowLeft) player.position.x -= speed
  if (keys.d || keys.ArrowRight) player.position.x += speed

  // Camera follows player
  camera.position.set(
    player.position.x,
    player.position.y + 5,
    player.position.z + 10
  )
  camera.lookAt(player.position)

  renderer.render(scene, camera)
}

animate()

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
