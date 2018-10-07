const eduUrl = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
const mapUrl = " https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

d3.json(mapUrl)
.then(data => {
    d3.json(eduUrl)
    .then(eduData => {
        const geodata = topojson.feature(data,data.objects.counties).features;
        const width = 1020;
        const height = 600;
        const tooltip = d3.select("#tooltip");
        const canvas = d3.select("#map")
        .attr("width",width)
        .attr("height", height);


        const path = d3.geoPath();

        let color = d3.scaleThreshold()
        .domain(d3.range(2.6, 75.1, (75.1-2.6)/8))
        .range(d3.schemeOranges[9]);


        let x = d3.scaleLinear()
        .domain([2.6, 75.1])
        .rangeRound([560, 860]);

        g = canvas.append("g")
        .attr("class", "key")
        .attr("id", "legend")
        .attr("transform", "translate(0,40)");
    
        g.selectAll("rect")
        .data(color.range().map(function(d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
            }))
            .enter().append("rect")
            .attr("height", 10)
            .attr("x", d => x(d[0]))
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("fill",d => color(d[0]));
        g.append("text")
            .attr("class", "caption")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
        
        g.call(d3.axisBottom(x)
            .tickSize(10)
            .tickFormat(x => Math.round(x) + '%' )
            .tickValues(color.domain()))
            .select(".domain")
            .remove();

        canvas.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(geodata)
            .enter().append("path")
            .attr("class", "county")
            .attr("data-fips", d => d.id)
            .attr("data-education", d => {
                let result = eduData.filter( el => {
                    return el.fips == d.id
                })
                if(result[0]) return result[0].bachelorsOrHigher;
                else return 0;
            })
            .attr("fill", d => {
                let result = eduData.filter(el => {
                    return el.fips == d.id
                })
                if(result[0]) return color(result[0].bachelorsOrHigher);
                else return color(0);
            })
            .attr("d", path)
            .on("mouseover", (d) =>{
                tooltip.style("opacity","1")
                .style("left", d3.event.pageX +"px")
                .style("top", d3.event.pageY + "px")
                .html(function(){
                    let val = eduData.filter( el => {
                        return el.fips == d.id;
                    })
                    // console.log(val)
                    return val[0]?`
                    <span>${val[0]["area_name"]}</span> : <span>${val[0]["state"]}</span> <span>${val[0].bachelorsOrHigher}%</span>
                    `:`${0}` 
                })
                d3.select(d3.event.target).style("opacity","0.5")
            })
            .on("mouseout", () =>{
                tooltip.style("opacity","0")
                d3.select(d3.event.target).style("opacity","1")
            })
   
    })
    .catch(console.log)
})
.catch(console.log)