const portAudio = require('naudiodon');
const Render = require('audio-render');
const fs = require('fs');

module.exports = new (function() {

	var _this = this;


	this.getDevices = portAudio.getDevices;

	this.monitor = function(device, callback)
	{
		if (typeof callback !== 'function')
		{
			console.error('audio.monitor: callback not a function');
			return;
		}

		if (!isNaN(device))
		{
			device = parseInt(device);
		}

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

					if (d.name.toLowerCase().replace(/[^a-z]/g, '').indexOf(device.toLowerCase().replace(/[^a-z]/g, ''))!==-1)
					{
						deviceId = d.id;
						break;
					}
				}
			break;

			default: // use default input device (usually mic)
		}

		// Setup AudioReader
		var pr = new portAudio.AudioReader({
			channelCount: 2,
			sampleFormat: portAudio.SampleFormat16Bit,
			sampleRate: 44100,
			deviceId: deviceId
		});

		var renderer = Render({
			render: function (canvas) {
				var fdata = this.getFrequencyData();
				callback(fdata);
			},
			channel: 0,
			framesPerSecond: 30,
			bufferSize: 44100,
			minDecibels: -100,
			maxDecibels: 0,
			fftSize: 1024,
			frequencyBinCount: 80,
			smoothingTimeConstant: 0.2,
		});

		// Start read
		pr.once('audio_ready', function(pa) {

			// pr.pipe(Render(function (canvas) {
			//     var data = this.getFrequencyData();
			// 	callback(data);
			// }));

			pr.pipe(renderer);
			pr.pa.start();
		});
	};
});
