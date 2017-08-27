var service = function(){
	var UIDGenerator = require('uid-generator');
	var uidgen3 = new UIDGenerator(128, UIDGenerator.BASE62);

	// Return the promise
	uidgen3.generate();	
}

module.exports = service;
