var stream_overlay = new (function() {
	var _this = this;

	// this.playing = false;
	// this.request_loop = false;

	this.sock;
	// audioCtx = new window.AudioContext;
	// this.buffer_stack = [];

	this.fps = 1000/15;
	this.bars = 100;
	this.freq_min = 0;
	this.freq_max = 100;

	this.init = function()
	{
		_this.setup_sockets();

		_this.build_visualizer();

		_this.send_audio_request();
	}

	this.build_visualizer = function()
	{
		var $vis = $('.visualizer');

		for (var i = 0, l = _this.bars; i < l; i++)
		{
			$('<div>')
				.addClass('bar')
				.css({
					"width"					: (100 / l) + "%",
					"left"					: (i * 100 / l) + "%",
					"transition"			: "all " + Math.floor(_this.fps) + "ms ease",
				})
				.append(
					$('<div>').addClass('inner-bar')
				)
			.appendTo($vis);
		}
	};

	this.setup_sockets = function()
	{
		_this.sock = io.connect('http://localhost:3000');
		_this.sock.on('connected', function() {
			console.log('Connected to socket server.');
		});
		_this.sock.on('audio_data', function(data) {
			_this.handle_audio_response(data);
		});
	};

	this.send_audio_request = function(request_loop)
	{
		if (request_loop)
			{ _this.request_loop = true; }
		_this.sock.emit('audio_request');
	};

	this.handle_audio_response = function(audioData)
	{
		_this.update_visualizer(audioData);
		setTimeout(_this.send_audio_request, this.fps);
		// _this.buffer_stack.push(audioData);
		//
		// if (_this.request_loop)
		// 	{ _this.send_audio_request(); }
		//
		// if (!_this.playing && _this.buffer_stack.length > 100)
		// 	{ _this.play_buffer_stack(); }
	};

	this.update_visualizer = function(data)
	{
		var $vis = $('.visualizer');
		var res = Math.floor(_this.freq_max / _this.bars);
		$vis.children().each(function(i) {
			var d = data[i*res];
			$(this).css("height", (100 + d) + "%");
		});
		// var $bars = $vis.children();
		// for (var i = 0; i < data.length; i += _this.increments)
		// {
		// 	$bars.eq(i).css("height", (100 + data[i]) + "%");
		// }
	};

	// this.stop = function()
	// {
	// 	_this.request_loop = false;
	// };
	//
	// this.play_buffer_stack = function()
	// {
	// 	_this.playing = true;
	// 	if (_this.buffer_stack.length == 0)
	// 	{
	// 		setTimeout(_this.play_buffer_stack, 50); // wait for buffers
	// 		return;
	// 	}
	//
	// 	var raw_audio = [];
	// 	var sample_rate = _this.buffer_stack[0].sampleRate;
	// 	var channels = _this.buffer_stack[0].numberOfChannels;
	// 	var audio_length = 0;
	// 	for (var buf = 0; buf < _this.buffer_stack.length; buf++)
	// 	{
	// 		var buffer = _this.buffer_stack[buf];
	// 		audio_length += buffer.duration;
	//
	// 		for (var channel = 0; channel < buffer.numberOfChannels; channel++)
	// 		{
	// 			if (!raw_audio[channel])
	// 				{ raw_audio[channel] = []; }
	//
	// 			for (var i = 0; i < buffer.length; i++)
	// 			{
	// 				raw_audio[channel].push(buffer._channelData[channel][i]);
	// 			}
	// 		}
	// 	}
	// 	_this.buffer_stack = [];
	//
	// 	// console.log(raw_audio);
	// 	// console.log(_this.buffer_stack);
	// 	// _this.buffer_stack = [];
	// 	// return;
	//
	//
	// 	var buffer = audioCtx.createBuffer(channels, audio_length * sample_rate, sample_rate);
	// 	for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
	// 		var nowBuffering = buffer.getChannelData(channel);
	// 		for (var i = 0; i < buffer.length; i++)
	// 		{
	// 			nowBuffering[i] = raw_audio[channel][i];
	// 		}
	// 	}
	//
	// 	var source = audioCtx.createBufferSource();
	// 	source.buffer = buffer;
	// 	source.onended = _this.play_buffer_stack;
	// 	source.connect(audioCtx.destination);
	// 	source.start();
	// };
});
$(stream_overlay.init);
