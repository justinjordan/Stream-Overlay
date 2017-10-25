var Bar = function(x, width) {
    var _this = this;
    this.x      = x;
    this.width  = width || 20;
    this.size   = 0;
    this.colors = [
        {
            skip: null,
            rgb: [255,0,0]
        },
        {
            skip: null,
            rgb: [0,255,0]
        }

    ];

    this.set_size = function(size)
    {
        this.size = size;
    };

    this.shift_color = function(power)
    {
        var color, prev, next;
        for (var i = 0; i < this.colors.length; i++)
        {
            color = this.colors[i];
            for (var x = 0; x < color.rgb.length; x++)
            {
                if (x == color.skip)
                {
                    continue;
                }

                prev = (x > 0 ? color.rgb[x-1] : color.rgb[color.rgb.length-1]);
                next = (x < color.rgb.length-1 ? color.rgb[x+1] : color.rgb[0]);

                if (color.rgb[x] < 255 && prev == 255 && next == 0)
                {
                    color.rgb[x] += power;
                    if (color.rgb[x] > 255) { color.rgb[x] = 255; }
                    break;
                }
                else if (prev == 0 && next == 255)
                {
                    color.rgb[x] -= power;
                    if (color.rgb[x] <= 0)
                    {
                        color.rgb[x] = 0;
                        color.skip = x;
                    }
                    break;
                }
            }
        }
    };
};
var BarsVisualizer = function(bar_num, bar_thickness) {
    var _this = this;
    var canvas = document.getElementById('visualizer');
    var context = canvas.getContext('2d');
    this.bars = [];

    this.init = function() {
        if (!canvas || !bar_num) { return; }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var x, w, spacing;
        for (var i = 0; i < bar_num; i++)
        {
            spacing = canvas.width / bar_num;
            x = i * spacing + spacing/2;
            w = bar_thickness;
            this.bars[i] = new Bar(x, w);
        }
    };

    this.update = function(data)
    {
        if (!Array.isArray(data))
            { return; }

        var bar, db, perc;
        for (var i = 0, l = _this.bars.length; i < l; i++)
        {
            bar = _this.bars[i];
            db = data[Math.floor(i * data.length / l)] + 100;

            bar.set_size(db / 100);
            bar.shift_color(1);
        }
    };

    this.draw = function()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);

        var bar, x, y, w, h, gradient;
        for (var i = 0, l = _this.bars.length; i < l; i++)
        {
            bar = _this.bars[i];
            w = bar.width;
            h = Math.floor(bar.size * canvas.height);
            x = Math.floor(bar.x - bar.width/2);
            y = canvas.height - h;

            gradient = context.createLinearGradient(0,canvas.height - h,0,canvas.height);
            gradient.addColorStop(0, "rgb("+bar.colors[0].rgb[0]+","+bar.colors[0].rgb[1]+","+bar.colors[0].rgb[2]+")");
            gradient.addColorStop(1, "rgb("+bar.colors[1].rgb[0]+","+bar.colors[1].rgb[1]+","+bar.colors[1].rgb[2]+")");
            context.fillStyle = gradient;
            // context.fillStyle = "rgb("+bar.rgb[0]+","+bar.rgb[1]+","+bar.rgb[2]+")";
            context.fillRect(x, y, w, h);
        }
    };
};
