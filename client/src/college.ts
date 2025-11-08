import * as THREE from 'three'

interface Room {
  name: string
  position: THREE.Vector3
  size: THREE.Vector3
  type: 'classroom' | 'restroom' | 'faculty' | 'lab' | 'canteen' | 'server'
}

export class CollegeBuilder {
  scene: THREE.Scene
  rooms: THREE.Mesh[] = []
  textureLoader: THREE.TextureLoader

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.textureLoader = new THREE.TextureLoader()
    this.buildCollege()
  }

  // Create realistic materials using real image textures
  private createBuildingMaterial(type: string): THREE.Material {
    // Texture URLs from free CDN sources
    const textureUrls = {
      classroom: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=512&q=80', // Brick wall
      restroom: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=512&q=80', // White tiles
      faculty: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=512&q=80', // Dark wood
      lab: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=512&q=80', // Modern office
      canteen: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=512&q=80', // Restaurant wall
      server: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=512&q=80', // Tech/server
    }

    const material = new THREE.MeshStandardMaterial({
      roughness: 0.8,
      metalness: 0.2
    })

    // Load texture asynchronously
    const textureUrl = textureUrls[type as keyof typeof textureUrls]
    if (textureUrl) {
      this.textureLoader.load(
        textureUrl,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.repeat.set(2, 2)
          material.map = texture
          material.needsUpdate = true
        },
        undefined,
        (error) => {
          console.log(`Failed to load texture for ${type}, using fallback color`)
          // Fallback colors if texture fails to load
          const fallbackColors = {
            classroom: 0xE8DCC4,
            restroom: 0xB0E0E6,
            faculty: 0x8B4513,
            lab: 0xE8F4F8,
            canteen: 0xFF7F50,
            server: 0x1E3A5F
          }
          material.color.setHex(fallbackColors[type as keyof typeof fallbackColors] || 0xCCCCCC)
        }
      )
    }

    return material
  }

  buildCollege() {
    const roomLayout: Room[] = [
      ...this.generateClassrooms(30),
      // 5 restrooms
      { name: 'Restroom 1', position: new THREE.Vector3(-15, 0.75, 0), size: new THREE.Vector3(3, 1.5, 3), type: 'restroom' },
      { name: 'Restroom 2', position: new THREE.Vector3(-15, 0.75, 10), size: new THREE.Vector3(3, 1.5, 3), type: 'restroom' },
      { name: 'Restroom 3', position: new THREE.Vector3(15, 0.75, 0), size: new THREE.Vector3(3, 1.5, 3), type: 'restroom' },
      { name: 'Restroom 4', position: new THREE.Vector3(15, 0.75, 10), size: new THREE.Vector3(3, 1.5, 3), type: 'restroom' },
      { name: 'Restroom 5', position: new THREE.Vector3(0, 0.75, -15), size: new THREE.Vector3(3, 1.5, 3), type: 'restroom' },
      // 3 faculty rooms
      { name: 'Faculty Room 1', position: new THREE.Vector3(-20, 0.75, 5), size: new THREE.Vector3(4, 1.5, 4), type: 'faculty' },
      { name: 'Faculty Room 2', position: new THREE.Vector3(-20, 0.75, -5), size: new THREE.Vector3(4, 1.5, 4), type: 'faculty' },
      { name: 'Faculty Room 3', position: new THREE.Vector3(20, 0.75, 5), size: new THREE.Vector3(4, 1.5, 4), type: 'faculty' },
      // 4 labs
      { name: 'Lab 1', position: new THREE.Vector3(-10, 0.75, -10), size: new THREE.Vector3(5, 1.5, 5), type: 'lab' },
      { name: 'Lab 2', position: new THREE.Vector3(-10, 0.75, -20), size: new THREE.Vector3(5, 1.5, 5), type: 'lab' },
      { name: 'Lab 3', position: new THREE.Vector3(10, 0.75, -10), size: new THREE.Vector3(5, 1.5, 5), type: 'lab' },
      { name: 'Lab 4', position: new THREE.Vector3(10, 0.75, -20), size: new THREE.Vector3(5, 1.5, 5), type: 'lab' },
      // 1 canteen
      { name: 'Canteen', position: new THREE.Vector3(0, 0.75, 20), size: new THREE.Vector3(10, 1.5, 8), type: 'canteen' },
      // 2 server rooms
      { name: 'Server Room 1', position: new THREE.Vector3(-25, 0.75, -15), size: new THREE.Vector3(3, 1.5, 3), type: 'server' },
      { name: 'Server Room 2', position: new THREE.Vector3(25, 0.75, -15), size: new THREE.Vector3(3, 1.5, 3), type: 'server' },
    ]

    // Create meshes with realistic materials
    roomLayout.forEach(room => {
      const geometry = new THREE.BoxGeometry(room.size.x, room.size.y, room.size.z)
      const material = this.createBuildingMaterial(room.type)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.copy(room.position)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData = { name: room.name, type: room.type }
      this.scene.add(mesh)
      this.rooms.push(mesh)
    })

    this.addCorridors()
    this.addDoors()
  }

  generateClassrooms(count: number): Room[] {
    const classrooms: Room[] = []
    const roomsPerRow = 10
    const roomSize = new THREE.Vector3(4, 1.5, 4)
    const spacing = 6

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / roomsPerRow)
      const col = i % roomsPerRow
      classrooms.push({
        name: `Classroom ${i + 1}`,
        position: new THREE.Vector3(
          (col - roomsPerRow / 2) * spacing,
          0.75,
          (row - 1.5) * spacing - 30
        ),
        size: roomSize,
        type: 'classroom'
      })
    }
    return classrooms
  }

  addCorridors() {
    // Load real concrete/floor texture for corridors
    const corridorMaterial = new THREE.MeshStandardMaterial({
      color: 0xC0C0C0,
      roughness: 0.9,
      metalness: 0.1
    })

    this.textureLoader.load(
      'https://images.unsplash.com/photo-1615873968403-89e068629265?w=512&q=80', // Concrete floor
      (texture: THREE.Texture) => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(10, 10)
        corridorMaterial.map = texture
        corridorMaterial.needsUpdate = true
      }
    )

    // Main horizontal corridor
    const mainCorridor = new THREE.Mesh(
      new THREE.BoxGeometry(80, 0.1, 4),
      corridorMaterial
    )
    mainCorridor.position.set(0, 0.05, 0)
    mainCorridor.receiveShadow = true
    this.scene.add(mainCorridor)

    // Vertical corridors
    for (let i = -3; i <= 3; i++) {
      const vCorridor = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.1, 60),
        corridorMaterial
      )
      vCorridor.position.set(i * 12, 0.05, -20)
      vCorridor.receiveShadow = true
      this.scene.add(vCorridor)
    }
  }

  addDoors() {
    // Load real wooden door texture
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.6,
      metalness: 0.3
    })

    this.textureLoader.load(
      'https://images.unsplash.com/photo-1606401074768-5c6f4c0b5821?w=512&q=80', // Wooden door
      (texture: THREE.Texture) => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        doorMaterial.map = texture
        doorMaterial.needsUpdate = true
      }
    )

    this.rooms.forEach((room, index) => {
      if (index % 3 === 0) {
        const door = new THREE.Mesh(
          new THREE.BoxGeometry(1, 2, 0.1),
          doorMaterial
        )
        door.position.set(
          room.position.x,
          1,
          room.position.z + room.geometry.parameters.depth / 2 + 0.5
        )
        door.castShadow = true
        this.scene.add(door)
      }
    })
  }
}
