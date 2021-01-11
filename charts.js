function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 

    var bacteriaSamples = data.samples;
    // console.log(bacteriaSamples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var bactSampArr = bacteriaSamples.filter(bactObj => bactObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var bactResult = bactSampArr[0];
    //console.log(bactResult);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = bactResult.otu_ids;
    
    otuIds = otuIds.slice(0,10).reverse();
    
    //console.log(otuIds);
    var otuLabels = bactResult.otu_labels;
    //otuLabels = otuLabels.sort((a,b) => b-a);
    otuLabels = otuLabels.slice(0,10).reverse();
    //console.log(otuLabels);
    var sampleValues = bactResult.sample_values;
    //sampleValues = sampleValues.sort((a,b) => b-a);
    sampleValues = sampleValues.slice(0,10).reverse();
    //console.log(sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(id => {
      return "OTU" + id
    });   
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      text: otuLabels,
      type: "bar",
      orientation: 'h'
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Cultures Found",
      xaxis: {title: ""},
      yaxis: {title: "OTU IDs"}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

        // Use Plotly to plot the data with the layout. 

    // 1. Create the trace for the bubble chart.
    //console.log(bactResult.otu_ids);
    var bubbleData = [
        {
        type: 'scatter',
        mode: 'markers',
        x: bactResult.otu_ids,
        y: bactResult.sample_values, 
        text: bactResult.otu_labels,
        marker: 
          {
          color: bactResult.sample_values,
          colorscale: [[0.0, 'red'], [0.2, 'blue'], [0.4, 'yellow'], [0.6, 'green'], [0.8, 'purple'], [1, 'magenta']], 
          cmin: 0,
          cmax: 250,
          size: bactResult.sample_values,
          sizemode: 'diameter'
          },
        }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: ""},
      yaxis: {title: ""}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    
    // 3. Create a variable that holds the washing frequency.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    var washFrequency = parseInt(result.wfreq);
    console.log(washFrequency);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFrequency, 
        title:  { text: "Belly Button Wash Frequency per Week"},
        type: "indicator",
        mode:  "gauge+number",
        gauge: {
          axis: {range: [null, 10]},
          bar: { color: "black" },
          steps: [
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lime"},
            {range: [8, 10], color: "green"}
          ]
        }
        }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width:  600,
      height: 500,
      margin: {t: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
