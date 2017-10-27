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
        var db, amp;
        var sum = 0;
        var max = 0;
        // var s = 4;
        var l = 1;
        var s = 2;
        // var l = data.length;
        l = (data.length < l ? data.length : l);

        for (var i = s; i < s + l; i++)
        {
            db = data[i];
            amp = Math.pow(10, db/20);

            // sum += amp;
            if (amp > 0.002 && amp > max)
            {
                max = amp;
            }
        }
        // size = sum / l;
        size = 100 * max;
        size = (size < 0 ? 0 : size > 1 ? 1 : size);
    };

    this.draw = function()
    {
        // var min = 0.5;
        // var scale = (1-min) * size + min;
        var min = 0.9;
        var max = 1;
        // var scale = max - size * (max - min);
        var scale = (1-min) * size + min;
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
