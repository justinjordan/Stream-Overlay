var LogoVisualizer = function() {
    var _this = this;
    var canvas = document.getElementById('visualizer');
    // var context = canvas.getContext('2d');
    var img = document.getElementById('logo');
    var size = 1;

    this.init = function()
    {
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
    };

    this.update = function(data)
    {
        if (!Array.isArray(data))
            { return; }
        if (data.length == 0)
        {
            size = 0;
            return;
        }

        var sum = 0;
        // var l = Math.floor(data.length/20);
        var v;
        var sum = 0;
        var max = 0;
        var s = 8;
        var l = 4;
        for (var i = s; i < s + l; i++)
        {
            v = (data[i]+100) / 100;
            sum += v;
            if (v > max)
            {
                max = v;
            }
        }
        // size = sum / l;
        size = max;
        size = (size < 0 ? 0 : size > 1 ? 1 : size);
    };

    this.draw = function()
    {
        // var min = 0.5;
        // var scale = (1-min) * size + min;
        var min = 0.5;
        var max = 1;
        var scale = max - size * (max - min);
        img.style.transform = "scale("+ scale +")";
        // context.clearRect(0, 0, canvas.width, canvas.height);
        //
        // var min = 0.7;
        //
        // var w = (1-min) * size * img.width + min * img.width;
        // var h = (1-min) * size * img.height + min * img.height;
        //
        // var x = canvas.width/2 - w/2;
        // var y = canvas.height/2 - h/2;
        //
        // context.drawImage(img, x, y, w, h);
        //
    };
};
