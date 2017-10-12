const portAudio = require('naudiodon');
const fs = require('fs');

module.exports = new (function() {

	this.getDevices = portAudio.getDevices;

	this.monitor = function(device, callback)
	{
		var deviceId = null;
		switch (typeof device)
		{
			case 'number': // by id
				deviceId = device;
			break;

			case 'string': // by name
				var devices = portAudio.getDevices();
				for (var x in devices)
				{
					var d = devices[x];

					if (d.name===device)
					{
						deviceId = d.id;
						break;
					}
				}
			break;

			default: // use mic (or default device)
		}

		// Setup AudioReader
		var pr = new portAudio.AudioReader({
			channelCount: 2,
			sampleFormat: portAudio.SampleFormat8Bit,
			sampleRate: 1000,
			deviceId: deviceId
		});

		// Start read
		pr.once('audio_ready', function(pa) {
			pr.pa.start();
		});

		// Send audio buffer back to callback :)
		pr.on('data', callback);
	};

});
