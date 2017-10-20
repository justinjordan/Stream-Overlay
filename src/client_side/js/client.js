var stream_overlay = new (function() {
	var _this = this;

	// this.playing = false;
	// this.request_loop = false;

	this.sock;
	// audioCtx = new window.AudioContext;
	// this.buffer_stack = [];

	this.bars = 100;
	this.freq_min = 0;
	this.freq_max = 100;

	this.init = function()
	{
		_this.setup_sockets();

		_this.build_visualizer();

		// _this.send_audio_request();
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
				})
				.append(
					$('<div>').addClass('inner-bar')
				)
			.appendTo($vis);
		}

		var colors = [
			[255,0,0],
			[0,255,0],
			[0,0,255],
			[255,255,0],
			[0,255,255],
			[255,0,255],
		];
		// var colors = new Array(
		//   [62,35,255],
		//   [60,255,60],
		//   [255,35,98],
		//   [45,175,230],
		//   [255,0,255],
		//   [255,128,0]);

		var step = 0;
		//color table indices for:
		// current color left
		// next color left
		// current color right
		// next color right
		var colorIndices = [0,1,2,3];

		//transition speed
		var gradientSpeed = 0.002;

		function updateGradient()
		{

		  if ( $===undefined ) return;

		var c0_0 = colors[colorIndices[0]];
		var c0_1 = colors[colorIndices[1]];
		var c1_0 = colors[colorIndices[2]];
		var c1_1 = colors[colorIndices[3]];

		var istep = 1 - step;
		var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
		var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
		var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
		var color1 = "rgb("+r1+","+g1+","+b1+")";

		var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
		var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
		var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
		var color2 = "rgb("+r2+","+g2+","+b2+")";

		 $('.visualizer .inner-bar').css({
			background: color1, /* For browsers that do not support gradients */
		    background: "-webkit-linear-gradient("+color1+", "+color2+")", /* For Safari 5.1 to 6.0 */
		    background: "-o-linear-gradient("+color1+", "+color2+")", /* For Opera 11.1 to 12.0 */
		    background: "-moz-linear-gradient("+color1+", "+color2+")", /* For Firefox 3.6 to 15 */
		    background: "linear-gradient("+color1+", "+color2+")", /* Standard syntax */
		});

		  step += gradientSpeed;
		  if ( step >= 1 )
		  {
		    step %= 1;
		    colorIndices[0] = colorIndices[1];
		    colorIndices[2] = colorIndices[3];

		    //pick two new target color indices
		    //do not pick the same as the current one
		    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
		    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;

		  }
		}

		setInterval(updateGradient,10);
	};

	this.setup_sockets = function()
	{
		_this.sock = io.connect(':3000');
		_this.sock.on('connected', function() {
			console.log('Connected to socket server.');
		});
		_this.sock.on('audio_data', function(data) {
			_this.handle_audio_response(data);
		});
	};

	// this.send_audio_request = function(request_loop)
	// {
	// 	if (request_loop)
	// 		{ _this.request_loop = true; }
	// 	_this.sock.emit('audio_request');
	// };

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
