// Initializes the page with a default plot
function init() {

    d3.json("samples.json").then(function (data) {
        //console.log(data)

        var id = data.samples[0].id;
        var otu_ids = data.samples[0].otu_ids;
        var sample_values = data.samples[0].sample_values;
        var otu_labels = data.samples[0].otu_labels;

        var Top10otuIds = otu_ids.slice(0, 10);

        // bar chart for top 10 otu_ids
        trace = [{
            x: sample_values,
            y: Top10otuIds.map(d => `OTU ${d}`),
            text: otu_labels.map(d => `OTU ${d}`),
            orientation: "h",
            type: "bar",
            mode: 'markers'
        }];

        layout = {
            title: "top 10",
            yaxis: {
                autorange: 'reversed'
            },
            font: {
                family: "Arial,sans-serif",
                size: 14,
                bold: true,
                color: '#7f7f7f'
            }
        };

        Plotly.newPlot("bar", trace, layout);

        // bubble chart
        var trace = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels.map(d => `OTU ${d}`),
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            }

        }];
        var layout = {
            title: 'Bubble Chart',
            xaxis:{
                title:"OTU ID"
            },
            font: {
                size: 16,
                bold: true,
                color: '#7f7f7f'
            },
            showlegend: false,
            height: 600,
            width: 1100
        };

        Plotly.newPlot("bubble", trace, layout);

        // metadata - Demographic info 
        var matadataSection = d3.select("#sample-metadata")
        Object.entries(data.metadata[0]).forEach(([key, value]) => {
            matadataSection.append('p').text(`${key}: ${value}`)
        });

        // Dropdown Menu 
        var names = data.names.map(function (d) {
            // console.log(d);
            return d;
        })
        d3.select("#selDataset").selectAll("option").data(names)
            .enter()
            .append("option")
            .attr("value", (d) => d)
            .text((d => d))
    })
};


// Submit handler
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged(subjectID) {
    // prevent page from refreshing 
    event.preventDefault();

    var subjectID = d3.select("#selDataset").node().value;

    updateChart(subjectID);
    updataMetadata(subjectID)
};

function updateChart(subjectID){
     
    d3.json("../samples.json").then(function (data) {
        // console.log(data)

        data.samples.map( row =>{
        if (row.id === subjectID) {
            var otu_ids = row.otu_ids;
            var sample_values = row.sample_values;
            var otu_labels = row.otu_labels;
            // console.log(id, otu_ids, sample_values, otu_labels)
            // Slice the top 10 OTUs found
            var Top10otuIds = otu_ids.slice(0, 10);
            // console.log(`Top10otuIds:${Top10otuIds}`)
            var trace1 = {
                x: sample_values,
                y: Top10otuIds.map(d => `OTU ${d}`),
                text: otu_labels.map(d => `OTU ${d}`),
                type: "bar",
                orientation: "h",
                mode: 'markers'
            };
            var data1 = [trace1];
            var layout1 = {
                title: "top 10 OTUs found in the ID",
                yaxis: {
                    autorange: 'reversed'
                },
                font: {
                    family: "Arial,sans-serif",
                    size: 14,
                    bold: true,
                    color: '#7f7f7f'
                }
            };
            Plotly.newPlot("bar", data1, layout1);

            // Bubble-chart
            var trace2 = {
                x: otu_ids,
                y: sample_values,
                text: otu_labels.map(d => `OTU ${d}`),
                mode: 'markers',
                marker: {
                    color: otu_ids,
                    size: sample_values
                }
            };
            var data2 = [trace2];
            var layout2 = {
                title: 'Bubble Chart',
                xaxis: {
                    title: "OTU ID",   
                },
                font: {
                    size: 16,
                    bold:true,
                    color: '#7f7f7f'
                },
                showlegend: false,
                height: 600,
                width: 1100
            };
            Plotly.newPlot("bubble", data2, layout2);
        }
        });   
    }) 
};

function updataMetadata(subjectID) {
     d3.json("../samples.json").then(function (data){
         //console.log(data.metadata)
         var demoInfo = d3.select("#sample-metadata")
            data.metadata.forEach((row)=>{
            if (row.id === parseInt(subjectID)) {
                console.log(`row id: ${row}`);

                // clear out prior content
                d3.select("#sample-metadata").html('');
                var metadata = Object.entries(row);
                metadata.forEach(function (data) {
                    //   console.log(data);
                      d3.select("#sample-metadata")
                        .append("p")
                        .data(data)
                        .text(`${data[0]}: ${data[1]}`)
                })
            }
        });
    })
}

init();
