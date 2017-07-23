
function service(server){

	var io = require("socket.io")(server);

	io.on('connection', function(socket){
		console.log('someone connected.');

		// Desconexão
		socket.on('disconnect', function(){
			console.log('someone disconnected.');		
		});
	})

	return io;
};

module.exports = service;