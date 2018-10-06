d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
.then( response => {
    const datas = response.data;

    const width = 600;
    const height = 600;
    const padding = 40;
    const margin = {
        top:20,
        left:70,
        bottom: 20,
        right:30
    }
    const canvas  = d3.select("svg").attr("width",width )
    .attr("height", height +padding).style('background', '#fff');

    const parseDate = d3.timeParse("%Y-%m-%d");
    const xScale = d3.scaleTime()      
      .domain(d3.extent(datas, d =>  parseDate(d[0])))  
      .range([margin.left, width - margin.right]);
    
    
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(datas, (d) => d[1]) ])
                     .range([height - margin.top,  margin.bottom]);

    let xAxes = d3.axisBottom(xScale).ticks(20);
    let yAxes = d3.axisLeft(yScale).ticks(30);
    canvas.append("g")
    .attr("class","axis y")
    .attr("transform", `translate(${margin.left},${0})`)
    .attr("id", "y-axis")
    .call(yAxes);
    
    canvas.append("g")
    .attr("class","axis x")
     .attr("transform",`translate(${0},${height-margin.bottom})`)
    .attr("id", "x-axis")
    .call(xAxes)

    canvas.selectAll("rect")
        .data(datas)
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("x", (d,i) =>xScale(parseDate(d[0])))
        .attr("y", (d,i) => yScale(d[1]) - margin.top+margin.bottom)
        .attr("width",(width/datas.length)-1)
        .attr("height", d => (height-margin.top) - yScale(d[1]))
        .attr("fill","steelblue")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .on("mouseover",(d) => {
            d3.select("#tooltip")
                .style("opacity",1)
            .html(`
                <p>${d[1]}</p>
                <p>${d[0]}</p>
            `)
                .style("left",(d3.event.pageX)+ "px")
                .style("top",(d3.event.pageY)+ "px")
            d3.select(d3.event.target).style("opacity",0.5).style("fill","#fff")
      })
      .on("mouseout",() => {
        d3.select("#tooltip")
            .style("opacity",0)
        d3.select(d3.event.target).style("opacity",1)
        .style("fill","steelblue")
    })
    canvas.append("text")
        .attr("class", "title")
        .attr("id", "title")
        .attr("x", width/2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .text("GDP Bar Chart width D3");

    canvas.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height + 10)
        .text("Years");

    canvas.append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .attr("x", -180)
        .attr("y", 20)
        .text("GDP (USD)");
})
.catch(err => console.log(err))


