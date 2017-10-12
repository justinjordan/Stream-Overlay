const express = require('express');
const path = require('path');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
var socket = null;

const audio = require('./audio');
// const audioStream = require('web-audio-stream/write');

// Settings
var opts = {
	audio_device	: null,
	// device NAME or ID; null is mic
	// use audio.getDevice() to list devices

	web_port		: 3000,
	socket_port		: 3001
};

// Socket server
io.on('connection', function(s) {
	console.log('Socket connetion...')
	socket = s;
});

// Serve public files (html, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// Start server
server.listen(opts.web_port, function() {
	console.log('Server running on port: '+ opts.web_port);
});

// Handle captured audio
audio.monitor(opts.audio_device, function(buffer) {
	if (!socket) return;

	socket.emit('audio', buffer);
});
