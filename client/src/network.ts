import { io, Socket } from 'socket.io-client'
import { SERVER_URL } from './config.ts'

export class Network {
  socket: Socket
  playerId: string = ''
  onPlayerJoined?: (data: any) => void
  onPlayerMoved?: (data: any) => void
  onPlayerLeft?: (id: string) => void

  constructor() {
    console.log('Connecting to server:', SERVER_URL)
    this.socket = io(SERVER_URL)

    this.socket.on('connect', () => {
      console.log('Connected to server!')
      this.playerId = this.socket.id || ''
    })

    this.socket.on('currentPlayers', (players: any) => {
      console.log('Current players:', players)
      Object.keys(players).forEach((id) => {
        if (id !== this.playerId && this.onPlayerJoined) {
          this.onPlayerJoined({ id, ...players[id] })
        }
      })
    })

    this.socket.on('newPlayer', (data: any) => {
      console.log('New player joined:', data)
      if (this.onPlayerJoined) {
        this.onPlayerJoined(data)
      }
    })

    this.socket.on('playerMoved', (data: any) => {
      if (this.onPlayerMoved) {
        this.onPlayerMoved(data)
      }
    })

    this.socket.on('playerDisconnected', (id: string) => {
      console.log('Player left:', id)
      if (this.onPlayerLeft) {
        this.onPlayerLeft(id)
      }
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })
  }

  emitPlayerPosition(x: number, y: number, z: number) {
    this.socket.emit('playerMovement', { x, y, z })
  }

  disconnect() {
    this.socket.disconnect()
  }
}
