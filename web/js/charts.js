var features = [];

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

    var chart = c3.generate({
        bindto: "#fdrChart",
        data: {
            x: 'x',
            columns: [xAxisVals, fdrData]
        },
        tooltip: {
            format: {
                title: function(x) { return "Features: " + x + 
                    " (last feature: " + features[x - 1] + ")"; },
                value: function(value, ratio, id, index) { return value.toFixed(2); }
            }
        },
        axis: {
            x: {
                label: {
                    text: "Number of Features",
                    position: "outer-center"
                }
            },
            y: {
                label: {
                    text: "Fisher's Discriminant Ratio",
                    position: "outer-middle"
                }
            }
        },
        legend: {
            show: false
        }
    });

});
