const url = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
const svg = d3.select("#tree-map"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

let fader = (color) => d3.interpolateRgb(color, "#fff")(0.2),
    color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
    format = d3.format(",d");

let treemap = d3.treemap()
    .size([width, height])
    .paddingInner(1);

d3.json(url, (error,data) =>{
  
  if (error) throw error;
  
  let root = d3.hierarchy(data)
      .eachBefore(d =>   d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
      .sum(sumBySize)
      .sort((a, b) => b.height - a.height || b.value - a.value);

  treemap(root);

  let cell = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  let tile = cell.append("rect")
      .attr("id", (d) => d.data.id)
      .attr("class", "tile")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d)  => d.y1 - d.y0)
      .attr("data-name", (d) =>  d.data.name)
      .attr("data-category", (d) =>  d.data.category)
      .attr("data-value", (d) =>  d.data.value)
      .attr("fill", (d) =>  color(d.data.category))
      .on("mousemove", (d) => {  
        d3.select("#tooltip").style("opacity", .9)
        .html(
        `<span>Name: ${d.data.name}</span>
        <br>
        <span>Category: ${d.data.category}</span>
        <br>
        <span>Value: ${d.data.value}</span>
        `
        )
        .attr("data-value", d.data.value)
        .style("left", (d3.event.pageX ) + "px") 
        .style("top", (d3.event.pageY) + "px"); 
      })    
      .on("mouseout", (d) => { 
        d3.select("#tooltip").style("opacity", 0); 
      })

  cell.append("text")
    .attr('class', 'tile-text')
    .selectAll("tspan")
    .data((d) =>  d.data.name.split())
    .enter().append("tspan")
    .attr("x", 4)
    .attr("y", (d, i)=> 13 + i * 10 )
    .style("font-size","10px")
    .text(d => d);


       
  let categories = root.leaves().map((nodes) =>  nodes.data.category);
  categories = categories.filter((category, index, self) => self.indexOf(category)===index);
  let legend = d3.select("#legend")
  let legendWidth = +legend.attr("width");
  const LEGEND_OFFSET = 10;
  const LEGEND_RECT_SIZE = 15;
  const LEGEND_H_SPACING = 150;
  const LEGEND_V_SPACING = 10;
  const LEGEND_TEXT_X_OFFSET = 3;
  const LEGEND_TEXT_Y_OFFSET = -2;
  var legendElemsPerRow = Math.floor(legendWidth/LEGEND_H_SPACING);
  
  let legendElem = legend
    .append("g")
    .attr("transform", "translate(60," + LEGEND_OFFSET + ")")
    .selectAll("g")
    .data(categories)
    .enter().append("g")
    .attr("transform", (d, i) => { 
      return 'translate(' + 
      ((i%legendElemsPerRow)*LEGEND_H_SPACING) + ',' + 
      ((Math.floor(i/legendElemsPerRow))*LEGEND_RECT_SIZE + (LEGEND_V_SPACING*(Math.floor(i/legendElemsPerRow)))) + ')';
    })
     
  legendElem.append("rect")                              
     .attr('width', LEGEND_RECT_SIZE)                          
     .attr('height', LEGEND_RECT_SIZE)     
     .attr('class','legend-item')                 
     .attr('fill', (d) => color(d))
     
   legendElem.append("text")                              
     .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)                          
     .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)                       
     .text(d =>d);  
});

function sumBySize(d) { return d.value;}
