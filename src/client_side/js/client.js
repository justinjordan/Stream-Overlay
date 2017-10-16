var stream_overlay = new (function() {
	var _this = this;

	this.sock = null;
	this.audio = null;
	this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	this.init = function()
	{
		_this.setup_audio();
		_this.setup_sockets();
	}

	this.setup_audio = function()
	{
		_this.audio = _this.audioCtx.createBufferSource();
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

	this.send_audio_request = function()
	{
		_this.sock.emit('audio_request');
	};

	this.handle_audio_response = function(data)
	{
		console.log(data);
	};
});
$(stream_overlay.init);
