const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const express = require('express');
const path = require('path');
const web = express();

const http = require('http');
const server = http.createServer(web);
const io = require('socket.io')(server);
var socket;

const audio = require('./audio');
var audio_data;

// Settings
var port = 3000;
var audio_device = process.argv[2];

var app = new (function() {
	this.init = function(audio_device)
	{
		// Socket server
		io.on('connection', function(s) {
			s.emit('connected');
			s.on('audio_request', function(data) {
				s.emit('audio_data', audio_data);
			});
		});

		// Serve client-side files (html, css, js)
		web.use(express.static(path.join(__dirname, 'client_side')));

		// Start server
		server.listen(port, function() {
			console.log('Server running on port: '+ port + "\n");
		});

		// Handle captured audio
		// console.log(audio.getDevices());
		audio.monitor(audio_device, function(data) {
			audio_data = data;
		});
	}
});

// Ask user which sound device to user
if (!audio_device)
{
	var devices = audio.getDevices();
	var options = {};
	var num = 1;
	for (var i = 0; i < devices.length; i++)
	{
		if (devices[i].maxInputChannels==0)
			{ continue; }

		options[num] = devices[i].id;
		process.stdout.write(num + ") " + devices[i].name + "\n");
		num++;
	}
	process.stdout.write("\n");

	rl.question('Which sound device? ', (answer) => {
		if (typeof options[answer] === 'undefined')
		{
			process.stdout.write("\n*** Please choose a number from the options. ***\n\n");
			rl.close();
			return;
		}

		var num = options[answer];

		process.stdout.write("\n");
		app.init(num);
		rl.close();
	});
}
else
{
	app.init();
}
