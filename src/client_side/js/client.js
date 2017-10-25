var stream_overlay = new (function() {
	var _this = this;

	this.sock;

	this.fps = 1000/15;
	this.bars = 80;

	this.visualizer;

	this.init = function()
	{
		_this.setup_sockets();
		_this.send_audio_request();
	}

	// this.build_visualizer = function()
	// {
	// 	var $vis = $('.visualizer');
	//
	// 	for (var i = 0, l = _this.bars; i < l; i++)
	// 	{
	// 		$('<div>')
	// 			.addClass('bar')
	// 			.css({
	// 				"width"					: (100 / l) + "%",
	// 				"left"					: (i * 100 / l) + "%",
	// 			})
	// 			.append(
	// 				$('<div>').addClass('inner-bar')
	// 			)
	// 		.appendTo($vis);
	// 	}
	//
	// 	var colors = [
	// 		[255,0,0],
	// 		[0,255,0],
	// 		[0,0,255],
	// 		[255,255,0],
	// 		[0,255,255],
	// 		[255,0,255],
	// 	];
	// 	// var colors = new Array(
	// 	//   [62,35,255],
	// 	//   [60,255,60],
	// 	//   [255,35,98],
	// 	//   [45,175,230],
	// 	//   [255,0,255],
	// 	//   [255,128,0]);
	//
	// 	var step = 0;
	// 	//color table indices for:
	// 	// current color left
	// 	// next color left
	// 	// current color right
	// 	// next color right
	// 	var colorIndices = [0,1,2,3];
	//
	// 	//transition speed
	// 	var gradientSpeed = 0.002;
	//
	// 	function updateGradient()
	// 	{
	//
	// 	  if ( $===undefined ) return;
	//
	// 	var c0_0 = colors[colorIndices[0]];
	// 	var c0_1 = colors[colorIndices[1]];
	// 	var c1_0 = colors[colorIndices[2]];
	// 	var c1_1 = colors[colorIndices[3]];
	//
	// 	var istep = 1 - step;
	// 	var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
	// 	var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
	// 	var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
	// 	var color1 = "rgb("+r1+","+g1+","+b1+")";
	//
	// 	var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
	// 	var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
	// 	var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
	// 	var color2 = "rgb("+r2+","+g2+","+b2+")";
	//
	// 	 $('.visualizer .inner-bar').css({
	// 		background: color1, /* For browsers that do not support gradients */
	// 	    background: "-webkit-linear-gradient("+color1+", "+color2+")", /* For Safari 5.1 to 6.0 */
	// 	    background: "-o-linear-gradient("+color1+", "+color2+")", /* For Opera 11.1 to 12.0 */
	// 	    background: "-moz-linear-gradient("+color1+", "+color2+")", /* For Firefox 3.6 to 15 */
	// 	    background: "linear-gradient("+color1+", "+color2+")", /* Standard syntax */
	// 	});
	//
	// 	  step += gradientSpeed;
	// 	  if ( step >= 1 )
	// 	  {
	// 	    step %= 1;
	// 	    colorIndices[0] = colorIndices[1];
	// 	    colorIndices[2] = colorIndices[3];
	//
	// 	    //pick two new target color indices
	// 	    //do not pick the same as the current one
	// 	    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
	// 	    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
	//
	// 	  }
	// 	}
	//
	// 	setInterval(updateGradient,10);
	// };
	//
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

	this.send_audio_request = function()
	{
		_this.sock.emit('audio_request');
	};

	this.handle_audio_response = function(audioData)
	{
		_this.update_visualizer(audioData);
		setTimeout(_this.send_audio_request, this.fps);
	};

	this.update_visualizer = function(data)
	{
		if (
			!_this.visualizer ||
			typeof _this.visualizer.update !== 'function' ||
			typeof _this.visualizer.draw !== 'function'
		)
			{ return; }

		_this.visualizer.update(data);
		_this.visualizer.draw();

		// var $vis = $('.visualizer');
		// var res = Math.floor(_this.freq_max / _this.bars);
		// $vis.children().each(function(i) {
		// 	if (i >= data.length)
		// 		{ return false; }
		//
		// 	var height = 100 * (100 + data[i]) / 60;
		// 	height = (height < 0 ? 0 : height > 100 ? 100 : height);
		//
		// 	$(this).css("height", height + "%");
		// });
	};
});
$(stream_overlay.init);
