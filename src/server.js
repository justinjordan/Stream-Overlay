const express = require('express');
const path = require('path');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
var socket;

const audio = require('./audio');
var audio_data;

// Settings
var opts = {
	audio_device	: null,
	// device NAME or ID; null is mic
	// use audio.getDevice() to list devices

	port		: 3000,
};

// Socket server
io.on('connection', function(s) {
	console.log('Socket connected.');

	s.emit('connected');

	s.on('audio_request', function(data) {
		console.log('audio_request');
		s.emit('audio_data', audio_data);
	});
});

// Serve client-side files (html, css, js)
app.use(express.static(path.join(__dirname, 'client_side')));

// Start server
server.listen(opts.port, function() {
	console.log('Server running on port: '+ opts.port);
});

// Handle captured audio
audio.monitor(opts.audio_device, function(data) {
	audio_data = data;
});
