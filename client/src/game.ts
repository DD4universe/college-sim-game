import * as THREE from 'three'
import { CollegeBuilder } from './college.ts'
import { Network } from './network.ts'

console.log('Game script loaded!')

// Remove loading indicator
const loadingEl = document.getElementById('loading')
if (loadingEl) {
  setTimeout(() => loadingEl.remove(), 1000)
}

// Initialize network
const network = new Network()
const otherPlayers = new Map<string, THREE.Mesh>()

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

// Add player name label
const createPlayerLabel = (name: string, color: number = 0x00ff00) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.width = 256
  canvas.height = 64
  context.fillStyle = `#${color.toString(16).padStart(6, '0')}`
  context.fillRect(0, 0, 256, 64)
  context.fillStyle = 'white'
  context.font = 'Bold 24px Arial'
  context.textAlign = 'center'
  context.fillText(name, 128, 40)
  
  const texture = new THREE.CanvasTexture(canvas)
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(2, 0.5, 1)
  sprite.position.y = 2
  return sprite
}

const myLabel = createPlayerLabel('You')
player.add(myLabel)

// Network event handlers
network.onPlayerJoined = (data) => {
  console.log('Creating mesh for player:', data.id)
  const otherPlayerGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8)
  const otherPlayerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
  const otherPlayer = new THREE.Mesh(otherPlayerGeometry, otherPlayerMaterial)
  otherPlayer.position.set(data.x || 0, data.y || 1, data.z || 10)
  otherPlayer.castShadow = true
  
  const label = createPlayerLabel(`Player ${data.id.substring(0, 4)}`, 0xff0000)
  otherPlayer.add(label)
  
  scene.add(otherPlayer)
  otherPlayers.set(data.id, otherPlayer)
}

network.onPlayerMoved = (data) => {
  const otherPlayer = otherPlayers.get(data.id)
  if (otherPlayer) {
    otherPlayer.position.set(data.x, data.y, data.z)
  }
}

network.onPlayerLeft = (id) => {
  const otherPlayer = otherPlayers.get(id)
  if (otherPlayer) {
    scene.remove(otherPlayer)
    otherPlayers.delete(id)
  }
}

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
let lastPosition = { x: player.position.x, y: player.position.y, z: player.position.z }
let positionUpdateCounter = 0

function animate() {
  requestAnimationFrame(animate)

  // Player movement
  if (keys.w || keys.ArrowUp) player.position.z -= speed
  if (keys.s || keys.ArrowDown) player.position.z += speed
  if (keys.a || keys.ArrowLeft) player.position.x -= speed
  if (keys.d || keys.ArrowRight) player.position.x += speed

  // Broadcast position if moved (throttled to every 3 frames)
  positionUpdateCounter++
  if (positionUpdateCounter >= 3) {
    positionUpdateCounter = 0
    if (
      Math.abs(player.position.x - lastPosition.x) > 0.01 ||
      Math.abs(player.position.z - lastPosition.z) > 0.01
    ) {
      network.emitPlayerPosition(player.position.x, player.position.y, player.position.z)
      lastPosition = { x: player.position.x, y: player.position.y, z: player.position.z }
    }
  }

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
