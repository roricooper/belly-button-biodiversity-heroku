function buildMetadata(sample) {


  var url = `/metadata/${sample}`
  d3.json(url).then(function(xdata) {

      // grab the panel by its id
      var md = d3.select("#sample-metadata");

      // wipe any paragraphs
      md.selectAll("p").remove()

      // loop over our object, append paragraphs
      for (var key in xdata) {
          // handle missing data
          var outdata = "";
          if (!xdata[key]) {
              outdata = "No data";
          } else {
              outdata = xdata[key];
          }

          md.append("p").text(`${key}: ${outdata}`);
      }

      console.log(xdata);

  });

// Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`

  // Use `.html("") to clear any existing metadata

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  var url = `/samples/${sample}`
  d3.json(url).then(function(xdata) {


      // make Pie chart

      // set up the trace
      var pieTrace = [ { "labels": xdata.otu_ids.slice(0,10),
                     "values": xdata.sample_values.slice(0,10),
                     "hoverinfo": "value+text",
                     "hovertext": xdata.otu_labels.slice(0,10),
                      "type": "pie" }];

      // clear prev plot
      Plotly.purge("pie");
      Plotly.plot("pie", pieTrace)

      // make Bubble chart

      // set up the trace
      var bubbleTrace = [{
          "x": xdata.otu_ids,
          "y": xdata.sample_values,
          "text": xdata.otu_labels,
          "mode": "markers",
          "marker": {
              "size": xdata.sample_values,
              "color": xdata.otu_ids,
              "colorscale": "Earth"
          }
      }];

      // clear prev plot
      Plotly.purge("bubble");
      // plot
      Plotly.plot("bubble",bubbleTrace);

  });

}

function init() {
// Grab a reference to the dropdown select element
var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.json("/names").then((sampleNames) => {
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
});
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

// Initialize the dashboard
init();