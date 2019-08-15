var io = require('socket.io').listen(5000)
 
io.sockets.on('connection', (socket) => {
  socket.on('name', (result) => {
    socket.name = result.name
    socket.fleet_id = result.fleet_id
    console.log(`${socket.name} connected / modified with fleet ${socket.fleet_id}`, '- NB connected:', io.sockets.server.eio.clientsCount)
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
    console.log(`${socket.name} disconnected`, '- NB connected:', io.sockets.server.eio.clientsCount)
  });
})
