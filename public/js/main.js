var stream_overlay = new (function() {
	var _this = this;

	this.sock = null;
	this.audio = null;
	this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	this.init = function()
	{
		_this.setup_audio();
		_this.setup_sockets();
		_this.setup_ui();
	}

	this.setup_audio = function()
	{
		_this.audio = _this.audioCtx.createBufferSource();
	};

	this.setup_ui = function()
	{
		// Create Visualizer
		var container = $('.bottom-bar');
		var total = 40;
		for (var i = 0; i < total; i++)
		{
			var width = 100/total;
			var x = Math.floor(i * width);

			$('<div>').css({
				'position'			: 'absolute',
				'left'				: x + '%',
				'bottom'			: 0,
				'width'				: Math.ceil(width) + '%',
				'height'			: '0',
				'background-color'	: '#aaa'
			}).appendTo(container);
		}
	};

	this.setup_sockets = function()
	{
		_this.sock = io.connect('http://localhost:3000');

		_this.sock.on('audio', function(buffer) {
			if (!buffer)
				{ return; }

			var data = new Uint8Array(buffer);

			_this.set_bars(data);
			// var interval = Math.ceil(data.length / 100);
			// var interval = 1;
			// var sum = 0;
			// for (var x = 0; x < data.length; x += interval)
			// {
			// 	sum += data[x];
			// }
			// var average = sum / data.length;
			// _this.audio_level(average/256);
		});
	};

	this.set_bars = function(data)
	{
		var bars = $('.bottom-bar div');
		bars.each(function() {
			var i = $(this).index();
			var data_i = Math.floor(i * data.length / bars.length);
			$(this).css('height', 100 * data[data_i]/256 + '%');
		});
	};
	// this.audio_level = function(ratio)
	// {
	// 	var container = $('.bottom-bar');
	// 	var bars = container.children();
	// 	var right = bars.last();
	//
	// 	for (var i = 0; i < bars.length - 1; i++)
	// 	{
	// 		var current = bars.eq(i);
	// 		current.css('height', current.next().css('height'));
	// 	}
	//
	// 	right.css('height', (ratio * 100) + '%');
	// };

});
$(stream_overlay.init);
