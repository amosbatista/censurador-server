var service = function(res){
	
	res.writeHead(200, {
		'Access-Control-Allow-Origin': '*'
	});

	res._head = {
		'Access-Control-Allow-Origin': '*'
	};

	return res;
}

module.exports = service;