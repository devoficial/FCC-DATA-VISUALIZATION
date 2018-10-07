
/**
 * Variables
  */
 const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
 const colors = ["#8A2BE2", "#5E4FA6", "#3586BE", "#00CED1", "#65C2A5", "#AEDCA8", "#E6F49C", "#FFFDC4", "#FDE185", "#FFAE5A", "#F07046", "#D83C50", "#800000", "#660000"];
 const tooltip = d3.select("#tooltip")
 
 const width = 850;
 const height = 500;
 const margin = { top: 110, right: 25, bottom: 130, left: 100 };
 
 
 
 /**
  * Functions
   */
 let formatMonths = (d) => {
     let months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
     return months[d - 1];
 }
 
 
 
 /**
  * canvas
   */
const canvas = d3.select('#heatmap')
                   .attr('width', width + margin.left + margin.right)
                   .attr('height', height + margin.top + margin.bottom)
 
 
 
 
 /**
  * Get JSON
   */
 d3.json(url)
 .then( res => {
     data = res.monthlyVariance;
    const year = [];
    const month = [];

     data.forEach((d, i) => {
         year.push(d.year);
         month.push(d.month);
     })
 
 
 
     // Create Scales
     const xScale = d3.scaleLinear()
                           .domain([d3.min(year), d3.max(year)])
                           .range([0, width]);
 
     const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
                     canvas.append("g")
                          .attr('id', 'x-axis')
                          .attr("transform", "translate("+ margin.left +","+ (height + margin.top) +")")
                          .call(xAxis);
     
     const yScale = d3.scaleBand()
                           .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) 
                           .range([0, height])
                           .round(0, 0)
 
     const yAxis = d3.axisLeft()
                          .scale(yScale)
                          .tickValues(yScale.domain())
                          .tickFormat( (month) =>  d3.timeFormat("%B")(new Date(0).setUTCMonth(month)) )
                          .tickSize(5, 0);
     
                      canvas.append("g")
                           .attr("id", "y-axis")
                           .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                           .call(yAxis)
      const colorScale =  d3.scaleQuantize()
      .domain(d3.extent(data, d => d.variance))
      .range(colors)
      
 
     // Create Heatmap
     const baseTemperature = data.baseTemperature;
     const rectwidth = width / (d3.max(year) - d3.min(year));
     const rectheight = height / 12;
     canvas.selectAll('rect')
          .data(data)
          .enter()
             .append('rect')
 
 
             .attr('height', rectheight)
             .attr('width', rectwidth)
             .attr('x', d => xScale(d.year))
             .attr('y', d => (d.month - 1) * rectheight)
             .attr('transform', 'translate(' + margin.left  +','+ margin.top +')')
             .attr('class', 'cell')
             .attr('data-month', d => [d.month - 1])
             .attr('data-year', d => d.year)
             .attr('data-temp', d => data.baseTemperature - d.variance)
             .attr('fill', d => colorScale(d.variance))
             .on("mouseover", function (d, i) {
               console.log(d)
                 tooltip
                     .attr('data-year', d.year)
                     .style("opacity","1")
                     .style("left", d3.event.pageX + 15 + "px")
                     .style("top", d3.event.pageY + -110 + "px")
                     .html(`
                             Year: ${parseInt(d.year, 10)}<br />
                             Temperature: ${res.baseTemperature - d.variance}C<br />
                             Variance: ${d.variance}C
                             `)
             })
             .on("mouseout", function (d) { tooltip.style("opacity", "0"); });
 
 })
 .catch(err => console.log(err))


 /**
  * Create Legend
   */
 let padding = 0;
 const legend = canvas.append('g')
                         .attr('id', 'legend')
                         .attr("transform", "translate(" + (margin.left + 20) + "," + (margin.top + 50) + ")")
 
 colors.forEach(function (color, i) {
 
     legend.append("rect")
              .attr("width", 30)
              .attr("height", 30)
              .attr("x", padding)
              .attr("y", height)
              .style("fill", color)
 
 
     legend.append("text")
              .text(`${i}C`)
              .attr("x", padding + 8)
              .attr("y", height + 42)
              .attr("class", "legend-text")
 
     padding += 30;
 });
 