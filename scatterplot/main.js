d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then( response => {
    const datas = response;
  
    const width = 600;
    const height = 400;
    const padding = 40;
    const margin = {
        top:20,
        left:70,
        bottom: 20,
        right:30
    }
    const canvas  = d3.select("svg").attr("width",width )
    .attr("height", height +padding).style('background', '#fff');

   
    const xScale = d3.scaleTime().domain([d3.min(datas, d => d.Year) - 2, d3.max(datas, d =>d.Year) + 2]) 
      .range([margin.left, width - margin.right]);
    
    
    const yScale = d3.scaleLinear().domain([d3.min(datas, d => {return parseFloat( d.Time.replace(":", ".") ).toFixed(2)}), d3.max(datas, d => { return parseFloat(d.Time.replace(":", ".")).toFixed(2)})])
    .range([margin.top, height-margin.bottom]);

    let xAxes = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format('Y'));;
    let yAxes = d3.axisLeft(yScale).ticks(10);

    canvas.append("g")
    .attr("class","axis y")
    .attr("transform", `translate(${margin.left},${0})`)
    .attr("id", "y-axis")
    .call(yAxes);
    
    canvas.append("g")
    .attr("class","axis x")
     .attr("transform",`translate(${0},${height-margin.bottom})`)
    .attr("id", "x-axis")
    .call(xAxes);

    canvas.selectAll("circle")
        .data(datas)
        .enter()
        .append("circle")
        .classed("dot", true)
        .attr("cx", (d,i) =>xScale((d.Year)))
        .attr("cy", (d,i) => yScale(parseFloat(d.Time.replace(":", "."))))
        .attr("r",4)
        .attr("data-xvalue",d => d.Year)
        .attr("data-yvalue",d => d.Time)
        .attr('fill', d => {
            // console.log(d)
            if(d.Doping == "")
              return "rgba(255, 127, 14, 0.6)";
            else
              return "rgba(12, 12, 250, 0.6)";
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 1).attr('class', 'dot')
        .on("mouseover",(d) => {
            d3.select("#tooltip")
                .attr("data-year", d3.event.target.dataset.xvalue )
                .style("opacity",1)
            .html(`
            <span>${d.Name}</span>:<span>${d.Nationality}</span><br>
            <span>Year:${d.Year}</span>  <span>Time:${d.Time}</span>
            <p>${d.Doping}</p>
            
            `)
                .style("left",(d3.event.pageX)+ "px")
                .style("top",(d3.event.pageY)+ "px")
            d3.select(d3.event.target).style("opacity",0.5)
      })
      .on("mouseout",() => {
        d3.select("#tooltip")
            .style("opacity",0)
        d3.select(d3.event.target).style("opacity",1)
    })
    let box1 = canvas.append('g').attr('transform', `translate(${width-margin.right*5}, ${height/2 - 20})`);
    let box2 = canvas.append('g').attr('transform', `translate(${width-margin.right*5}, ${height/2})`);
    box1.append('text')
      .text('No doping allegations');
    box1.append('rect')
      .attr('width', 18).attr('height', 18)
      .attr('fill', 'rgb(255, 127, 14)').attr('x', -20).attr('y', -15);
  
    box2.append('text')
      .text('Riders with doping allegations');
    box2.append('rect')
      .attr('width', 18).attr('height', 18)
      .attr('fill', 'rgb(31, 119, 180)').attr('x', -20).attr('y', -15);
    
    let yInfo = canvas.append('text').attr('class', 'time').attr('x', 50).attr('y', 250);
    yInfo.text('Time in Minutes').attr('transform', 'rotate(-90, 90, 250)');
})
.catch(err => console.log(err))

