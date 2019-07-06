__customIndicators = [
    {
        name: "Equity",
        metainfo: {
            _metainfoVersion: 40,
            id: "Equity@tv-basicstudies-1",
            scriptIdPart: "",
            name: "Equity",
            description: "Equity",
            shortDescription: "Equity",
            is_hidden_study: true,
            is_price_study: true,
            isCustomIndicator: true,
            plots: [{ id: "plot_0", type: "line" }],
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        visible: true,
                        // 使线条变细
                        linewidth: 1,
                        // 绘制类型为线性图
                        plottype: 2,
                        // 显示价格线
                        trackPrice: true,
                        transparency: 40,
                        // 为图线设置深红色。
                        color: "#880000"
                    }
                },
                // 精度是一位数，如777.7
                precision: 1,
                inputs: {}
            },
            styles: {
                plot_0: {
                    // 输出名字在样式窗口显示
                    title: "Equity value",
                    histogramBase: 0
                }
            },
            inputs: []
        },
        constructor: function() {
            this.init = function(context, inputCallback) {
                console.log(context,"init")
                this._context = context;
                this._input = inputCallback;
                var symbol = "#EQUITY";
                this._context.new_sym(
                    symbol,
                    PineJS.Std.period(this._context),
                    PineJS.Std.period(this._context)
                );
            };
            this.main = function(context, inputCallback) {
                this._context = context;
                console.log(PineJS.Std.close(this._context))
                this._input = inputCallback;
                this._context.select_sym(1);
                var v = PineJS.Std.close(this._context);
                return [v];
            };
        }
    }
];
