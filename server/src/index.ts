import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const httpServer = createServer(app)

// CORS configuration
app.use(cors({
  origin: [
    /https:\/\/fun-game-.*\.vercel\.app$/,
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}))

app.use(express.json())

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      /https:\/\/fun-game-.*\.vercel\.app$/,
      'http://localhost:5173',
      'http://localhost:3000'
    ],
    credentials: true
  }
})

// Player data structure
interface PlayerData {
  id: string
  username: string
  x: number
  y: number
  z: number
  color: string
}

// in-memory map of connected players
const players = new Map<string, PlayerData>()

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id)
  
  // Wait for player to send join event with username
  socket.on('playerJoin', (data: { username: string }) => {
    const username = data.username || `Guest_${socket.id.substring(0, 4)}`
    
    // Random spawn position to avoid overlap
    const spawnX = Math.random() * 20 - 10
    const spawnZ = Math.random() * 20 - 10
    
    // Random color for player
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    // Create player data
    const playerData: PlayerData = {
      id: socket.id,
      username,
      x: spawnX,
      y: 1,
      z: spawnZ,
      color
    }
    
    players.set(socket.id, playerData)
    
    console.log(`Player joined: ${username} (${socket.id})`)
    
    // Send all current players to the new player
    const allPlayers: { [key: string]: PlayerData } = {}
    players.forEach((player, id) => {
      allPlayers[id] = player
    })
    socket.emit('currentPlayers', allPlayers)
    
    // Notify all other players about the new player
    socket.broadcast.emit('newPlayer', playerData)
  })

  // Handle player movement
  socket.on('playerMovement', (data: { x: number; y: number; z: number }) => {
    const player = players.get(socket.id)
    if (player) {
      player.x = data.x
      player.y = data.y
      player.z = data.z
      
      // Broadcast to all other players
      socket.broadcast.emit('playerMoved', {
        id: socket.id,
        x: data.x,
        y: data.y,
        z: data.z
      })
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const player = players.get(socket.id)
    if (player) {
      console.log(`Player disconnected: ${player.username} (${socket.id})`)
      players.delete(socket.id)
      socket.broadcast.emit('playerDisconnected', socket.id)
    }
  })
})

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    players: players.size,
    message: 'College Simulator Multiplayer Server'
  })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
