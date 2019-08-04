var io = require('socket.io').listen(5000)
 
io.sockets.on('connection', (socket) => {
  socket.on('name', (name) => {
    socket.name = name
    console.log(`${name} connected`)
  })
  socket.on('boss', (fleet) => {
    let fleetID = `fleet-${fleet.fleet_id}`
    console.log(fleetID, 'by', socket.name)
    socket.broadcast.emit(fleetID, fleet)
  })

  socket.on('msg', () => {
    console.log('Chat message by ', socket.name);
  })
})
