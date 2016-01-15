var features = [];
var bandWidths = ["0.01", "0.02", "0.03", "0.04", "0.06", "0.10", "0.16", 
                  "0.25", "0.40", "0.63", "1.00"];
var numFeatures = 41;
var bandWidth = "0.01";

//Histogram.
d3.text("../data_files/histogram_nrf" + numFeatures + "_bw" + bandWidth + ".csv", function(text) {

    var histData = ["Fraction of Simulations [%]"];

    d3.csv.parseRows(text, function(row) {
        histData.push(+row[1]);
    });

    c3.generate({
        bindto: "#histChart",
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

});
