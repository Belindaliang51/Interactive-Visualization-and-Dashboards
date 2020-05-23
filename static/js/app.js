
function updateChart(){
     
    d3.json("../samples.json").then(function (data) {
        console.log(data)

        
        data.samples.map( row =>{
            var id = row.id;
            var otu_ids = row.otu_ids;
            var sample_values = row.sample_values;
            var otu_labels = row.otu_labels;
            // console.log(id, otu_ids, sample_values, otu_labels)
            
            // Slice the top 10 OTUs found
            var Top10otuIds = otu_ids.slice(0, 10);
           
            // console.log(`Top10otuIds:${Top10otuIds}`)
            

            var trace1 = {
                x: sample_values,
                y: Top10otuIds.map( d => `OTU ${d}`),
                type: "bar",
                orientation: "h",
                mode: 'markers'
            };

            var data1 = [trace1];

            var layout1 = {
                title: "top 10 OTUs found in the ID",
                yaxis: {
                    autorange: 'reversed'
                }
            };

            Plotly.newPlot("bar", data1, layout1);


            // Bubble-chart
            var trace2 = {
                x: otu_ids,
                y: sample_values,
                mode: 'markers',
                marker: {
                    color: otu_ids,
                    size: sample_values
                }

            };

            var data2 = [trace2];

            var layout2 = {
                title: 'Bubble Chart Hover Text',
                showlegend: true,
                height: 600,
                width: 1600
            };

            Plotly.newPlot("bubble", data2, layout2);

            //  metadata 
            var matadataSection = d3.select("#sample-metadata")
            Object.entries(data.metadata).forEach(([key, value]) => {
                matadataSection.append('p').text(`${key}: ${value}`)
            })

            // Dropdown List 
            var name = data.names;
            var dropDown = d3.select("#selDataset")
            var dataSet = dropDown.append('option').text(name)

            console.log(name)
            
        })
        
        }
    )  
}

//updatePlotly()

// Initializes the page with a default plot
function init(){

    d3.json("../samples.json").then(function (data) {
        //console.log(data)

        var id = data.samples[0].id;
        var otu_ids = data.samples[0].otu_ids;
        var sample_values = data.samples[0].sample_values;
        var otu_labels = data.samples[0].otu_labels;

        var Top10otuIds = otu_ids.slice(0, 10);

        // bar chart for top 10 otu_ids
        trace = [{
            x:sample_values,
            y: Top10otuIds.map(d => `OTU ${d}`),
            text: Top10otuIds.map(d => `OTU ${d}`),
            orientation:"h",
            type :"bar",
            mode: 'markers'
        }];

        layout = {
            title:"top 10",
            yaxis:{
                autorange:'reversed'
            }
        };

        Plotly.newPlot("bar",trace, layout);

        // bubble chart
        var trace = [{
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            }

        }];
        var layout = {
            title: 'Bubble Chart Hover Text',
            showlegend: true,
            height: 600,
            width: 1100
        };

        Plotly.newPlot("bubble", trace, layout);

        // metadata 
        var matadataSection = d3.select("#sample-metadata")
        Object.entries(data.metadata[0]).forEach(([key, value])=>{
            matadataSection.append('p').text(`${key}: ${value}`)
            })
            
        // // Dropdown List 
        // var name = data.names[0];
        // var dropDown = d3.select("#selDataset")
        // var dataSet = dropDown.append('option').text(name)


        var names = data.names.map(function (d) {
            console.log(d);
            return d;
        })

        d3.select("#selDataset").selectAll("option").data(names)
                .enter()
                .append("option")
                .attr("value",(d)=>d)
                .text((d=>d))

       


        
    })

   
    
    //updatePlotly()
};


// // Listen to the slider?
// d3.select("#selDataset").on("change", function (d) {
//     selectedGroup = this.value
//     updateChart(selectedGroup)
// })

init()