var features = [];
classes = ["hl", "hs", "ne", "sl", "ss"];
var bandwidths = ["0.01", "0.02", "0.03", "0.04", "0.06", "0.10", "0.16", 
                  "0.25", "0.40", "0.63", "1.00"];
var numFeatures = 41;
var bw = "0.01";
var padding = 10;
var chartWidth = document.body.clientWidth / 2 - padding * 2;
var heatmapWidth = document.body.clientWidth / 3;
var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

//FDR chart.
d3.text("../data_files/FDR.csv", function(text) {

    var fdrData = ["Fisher's Discriminant Ratio"];
    var xAxisVals = ['x'];
    var numFeatures = 1;

    d3.csv.parseRows(text, function(row) {
        fdrData.push(+row[1]);
        xAxisVals.push(numFeatures);
        features.push(row[0]);
        numFeatures++;
    });

    c3.generate({
        bindto: "#fdrChart",
        size: {
            width: heatmapWidth,
            height: heatmapWidth
        },
        data: {
            x: 'x',
            columns: [xAxisVals, fdrData]
        },
        tooltip: {
            format: {
                title: function(x) { return features[x - 1]; },
                value: function(value, ratio, id, index) { return value.toFixed(2); }
            }
        },
        axis: {
            x: {
        //         type: "category",
        //         tick: {
        //             rotate: 75,
        //             format: function(x) { return features[x]; }
        //         },
                label: {
                    text: "Feature (Hover over Point for Name)",
                    position: "outer-center"
                }
            },
            y: {
                label: {
                    text: "Ratio",
                    position: "outer-middle"
                }
            }
        },
        legend: {
            show: false
        }
    });

    corrMat();
    confMat();
    scoreHist();

});

//Correlation coefficient matrix.
function corrMat() {

    var corrData = [];
    var gridSize = (heatmapWidth - padding * 2) / features.length;

    var corrColors = d3.scale.quantile()
        .domain([-1,1])
        .range(colors);

    var corrSvg = d3.select("#corr").append("svg")
        .attr("width", heatmapWidth)
        .attr("height", heatmapWidth)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding + ")");

    var rowNum = 0
    d3.text("../data_files/corr_coef_" + numFeatures + ".csv", function(text) {
        d3.csv.parseRows(text, function(row) {
            for(var colNum = 0; colNum < row.length; colNum++) {
                corrData.push({"row": rowNum, "col": colNum, "val": +row[colNum]});
            }
            rowNum++;
        });

        var heatmap = corrSvg.selectAll()
            .data(corrData, function(d) { return d.row + ":" + d.col; });

        heatmap.enter().append("rect")
            .attr("x", function(d) { return d.col * gridSize; })
            .attr("y", function(d) { return d.row * gridSize; })
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", function(d) { return corrColors(d.val); });

        heatmap.transition()
            .style("opacity", function(d) { 
                if(d.row >= numFeatures || d.col >= numFeatures) {
                    return 0.2;
                } else {
                    return 1; 
                }
            });
    });
}

//Confusion matrix.
function confMat() {

    var confData = [];
    var gridSize = (heatmapWidth - padding * 2) / classes.length;

    var confColors = d3.scale.quantile()
        .domain([0,0.2])
        .range(colors);

    var confSvg = d3.select("#conf").append("svg")
        .attr("width", heatmapWidth)
        .attr("height", heatmapWidth)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding + ")");

    var rowNum = 0
    d3.text("../data_files/confusion_m_nrf" + numFeatures + "_bw" + bw + ".csv", function(text) {
        d3.csv.parseRows(text, function(row) {
            for(var colNum = 0; colNum < row.length; colNum++) {
                confData.push({"row": rowNum, "col": colNum, "val": +row[colNum]});
            }
            rowNum++;
        });

        var heatmap = confSvg.selectAll()
            .data(confData, function(d) { return d.row + ":" + d.col; });

        heatmap.enter().append("rect")
            .attr("x", function(d) { return d.col * gridSize; })
            .attr("y", function(d) { return d.row * gridSize; })
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", function(d) { return colors[0]; });
        
        heatmap.transition()
            .style("fill", function(d) { return confColors(d.val); });
    });
}

//Histogram.
function scoreHist() {
    d3.text("../data_files/histogram_nrf" + numFeatures + "_bw" + bw + ".csv", function(text) {

        var histData = ["Fraction of Simulations [%]"];

        d3.csv.parseRows(text, function(row) {
            histData.push(+row[1]);
        });

        c3.generate({
            bindto: "#histChart",
            size: {
                width: heatmapWidth
            },
            data: {
                columns: [histData],
                type: "bar"
            },
            tooltip: {
                format: {
                    title: function(x) { return "Classification Score [%]: " + x; },
                    value: function(value, ratio, id, index) { return value.toFixed(2); }
                }
            },
            axis: {
                x: {
                    label: {
                        text: "Classification Score [%]",
                        position: "outer-center"
                    }
                },
                y: {
                    label: {
                        text: "Fraction of Simulations [%]",
                        position: "outer-middle"
                    }
                }
            },
            legend: {
                show: false
            }
        });
    });
}
