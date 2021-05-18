
var barChart = d3.select("#bar");
var gaugePlot = d3.select("#gauge");
var bubblePlot = d3.select("#bubble");
var sampleMetadata = d3.select("#sample-metadata");
var dropdown = d3.select("select");
var selection = dropdown.property("value");
var metadata;
var samples;
var index;
var data = d3.json("./data/samples.json")

function unpack(rows, index) {
    return rows.map(
        function(row) {
            return row[index];
        });
};

function getIndex(selected, results){
        var named = results.names
        index = named.indexOf(selected)
        console.log(named)
        console.log(selected)
        console.log(index)
        return index
};

function optionChanged(dropdownSelect){
    dropdown.on("onchange", updatewebPage(dropdownSelect))
};

function charts(selectedIndex){
    data.then(function(sampledata) {
        var sampleSamples = sampledata.samples
        var expanding = Object.entries(sampleSamples)
        var values = unpack(expanding,1)
        var filteredSample = values[selectedIndex]
        var sampleValues = filteredSample.sample_values
        var otuIDs = filteredSample.otu_ids
        
        var otuLabels = filteredSample.otu_labels

        var top10_Values = sampleValues.slice(0,10)
        var top10_IDs = otuIDs.slice(0,10)
        top10_IDs.forEach((val,index)=> top10_IDs[index] = `OTU ${val}`)
        var top10_Labels = otuLabels.slice(0,10)
        barChart.html("")
        bubblePlot.html("")
        var barTrace = [{
            x: top10_Values,
            y: top10_IDs,
            text: top10_Labels,
            type: "bar",
            orientation: 'h'
           
        }];
        var bubbleTrace = [{
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIDs
            }
        }]
        Plotly.newPlot("bar", barTrace)
        Plotly.newPlot("bubble", bubbleTrace, {xaxis: {title: "OTU ID"}})
        })   
};

function init() {
    data.then(function(samples) {
        Object.entries(samples.names).forEach(function([key, value]) {
        var options = dropdown.append("option")
        .attr('value', value)
        options.text(value)
     }) 
    })
    updatewebPage(940)
    charts(0)
    
};

function updatewebPage(sampleNumber){
    data.then(function(sampledata) {
        var filtered = sampledata.metadata.filter(d => d.id === parseInt(sampleNumber))
        var datavalues = Object.values(filtered)
        const filteredData = datavalues[0]
        sampleMetadata.html("")
        for (const[key,value] of Object.entries(filteredData)) {
            sampleMetadata.append("p").text(key + ' : ' + value)
        }
        var sampleIndex = getIndex(sampleNumber, sampledata)
        charts(sampleIndex)
    })
   
};

init();