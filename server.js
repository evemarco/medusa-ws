require('dotenv').config()
const io = require('socket.io').listen(process.env.PORT)
const redisAdapter = require('socket.io-redis')
io.adapter(redisAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }))
console.log('Key:', process.env.KEY)

io.sockets.on('connection', (socket) => {
  socket.on('name', (result) => {
    socket.name = result.name
    socket.character_id = result.character_id
    socket.fleet_id = result.fleet_id
    emitFleets(socket, false)
  })
  socket.on('boss', (fleet) => {
    let fleetID = `fleet-${fleet.fleet_id}`
    // console.log(fleetID, 'by', socket.name)
    socket.broadcast.emit(fleetID, fleet)
  })
  socket.on('msg', () => {
    console.log('Chat message by ', socket.name)
  })
  socket.on('disconnect', () => {
    emitFleets(socket, true)
  })
})

function emitFleets (socket, disconnect) {
  io.of('/').adapter.clients((err, clients) => {
    if (disconnect) console.log(`${socket.name} disconnected`, '- NB connected:', clients.length)
    else console.log(`${socket.name} connected / modified with fleet ${socket.fleet_id}`, '- NB connected:', clients.length)
    let fleets = new Map()
    let count = 0
    for (client of clients) {
      const player = io.of('/').adapter.nsp.sockets[client]
      if (player.name) {
        count++
        if (!fleets[player.fleet_id]) fleets[player.fleet_id] = []
        fleets[player.fleet_id].push({ name: player.name, character_id: player.character_id, socket: player.id })
      }
    }
    socket.broadcast.emit(`clients-${process.env.KEY}`, fleets)
    console.log(JSON.stringify({ fleets: fleets, count: count, date: new Date().toISOString() }))
  })
}
