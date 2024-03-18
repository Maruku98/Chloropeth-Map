//Select DOM elements
const tooltip = document.getElementById("tooltip");
const countyName = document.getElementById("county-name");
const percentage = document.getElementById("percentage");


//JSON Data
let educationData = null;  //Education JSON will be stored here later
let countyData = null;     //County JSON will be stored here later

//Fetch JSON data and save the data
(async function retrieveData() {
    try {
        const educationFetch = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json");
        const countyFetch = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json");

        const educationJson = await educationFetch.json();
        const countyJson = await countyFetch.json();

        educationData = educationJson;
        countyData = countyJson;
        createChart();
    }
    catch(message) {
        console.log(`Something went wrong. Error message: ${message}`)
    };
})();

function createChart() {
    //Select SVG
    const svg = d3.select("#root");
    const maxScore = d3.max(educationData, data  => data.bachelorsOrHigher); //Find max bachelor's percentage
    const minScore = d3.min(educationData, data  => data.bachelorsOrHigher); //Find min bachelor's percentage
    
    //Define GeoJSON Paths from TopoJSON
    const path = d3.geoPath();
    let counties = topojson.feature(countyData, countyData.objects.counties);
    let states = topojson.mesh(countyData, countyData.objects.states);

    //Define treshold for counties' filling colors
    let colorScale = d3.scaleThreshold();
    colorScale.domain(d3.range(minScore, maxScore, (maxScore - minScore) / 8));
    colorScale.range(d3.schemeOranges[8]);

    //Define xAxis for map legend
    const xAxis = d3.scaleLinear();
    xAxis.domain([0, 80]);
    xAxis.range([0, 30 * 8]);

    //DEFINE CHLOROPETH
    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(counties.features)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("data-index", (data) => {
            //Indexes between the two JSON documents don't match, so
            //store the matching index in the data-index attribute for later use
            let correctIndex;
            for (let i = 0; i < 3142; i++) {
                if (educationData[i].fips == data.id) { correctIndex = i };
            };
            return correctIndex;
        })
        .style("fill", (data, index, el) => {
            let getIndex = Number(el[index].getAttribute("data-index")); //Get data-index attribute value
            return colorScale(educationData[getIndex].bachelorsOrHigher);
        })
        .attr("data-fips", (data, index, el) => {
            let getIndex = Number(el[index].getAttribute("data-index")); //Get data-index attribute value
            return educationData[getIndex].fips;
        })
        .attr("data-education", (data, index, el) => {
            let getIndex = Number(el[index].getAttribute("data-index")); //Get data-index attribute value
            return educationData[getIndex].bachelorsOrHigher;
        })
        .attr("data-area", (data, index, el) => {
            let getIndex = Number(el[index].getAttribute("data-index")); //Get data-index attribute value
            return `${educationData[getIndex].area_name}, ${educationData[getIndex].state}`;
        })
        .on("mouseover", (e) => { //Data from the tooltip is fetched from data-attributes
            d3.select(tooltip)
                .style("display", "block")
                .attr("data-education", () => e.target.getAttribute("data-education"));
            d3.select(countyName).text(() => e.target.getAttribute("data-area"));
            d3.select(percentage).text(() => e.target.getAttribute("data-education") + "%")
        })
        .on("mouseout", (e) => {
            d3.select(tooltip).style("display", "none");
        });
    
    //Chloropeth map legend
    svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${1175 - (30 * 8)}, 0)`)
        .selectAll("rect")
        .data(d3.schemeOranges[8])
        .enter()
        .append("rect")
        .attr("class","legend-tile")
        .attr("x", (data, index) => {
            return index * 30;
        })
        .style("fill", data => data)
    
    //Legend axis
    svg.select("#legend")
        .append("g")
        .attr("id", "x-axis")
        .style("transform", "translate(0, 15px)")
        .call(d3.axisBottom(xAxis).ticks(8));
    
    //Chloropeth mesh (states' borders)
    svg.append("path")
        .datum(states)
        .attr("d", path)
        .attr("class", "mesh");
    
    //Move both counties container and mesh
    svg.selectAll(".counties,.mesh")
        .attr("transform", "translate(150, 25)");
};