




(function(){

      d3 = d3 || {};

      d3.histogramChart = function () {
        var margin = {top: 0, right: 0, bottom: 20, left: 0},
            width = 960,
            height = 500,containerId,minMax,svg;

        var histogram = d3.layout.histogram(),
            x = d3.scale.ordinal(),
            x_rev = d3.scale.linear(),
            y = d3.scale.linear(),
            xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(6, 0);
        var brush = d3.svg.brush();
        function chart(selection) {
          selection.each(function(data) {

            width = parseInt(d3.select(containerId).style("width"));
            height = parseInt(d3.select(containerId).style("height"));

            // var container = d3.select(this);
                      rawData =  data;

                      // container.attr('height',height)
                      //     .attr('width',width);

            // Compute the histogram.
            data = histogram(data);
            //console.log(data);

            // Update the x-scale.
            x   .domain(data.map(function(d) { return d.x; }))
                .rangeRoundBands([0, width - margin.left - margin.right], .1);

            x_rev.domain([0,width- margin.left - margin.right])
                .range(minMax);

            // Update the y-scale.
            y   .domain([0, d3.max(data, function(d) { return d.y; })])
                .range([height - margin.top - margin.bottom, 0]);

                brush.x(x)
                              //.extent(defaultBushExtent)
                              .on("brush", brushmove)
                              //.on("brushend", brushend);
            // Select the svg element, if it exists.
            if(!svg)
            {
              svg = d3.select(this).selectAll("svg").data([data]);

              // Otherwise, create the skeletal chart.
              var gEnter = svg.enter().append("svg").append("g");
              gEnter.append("g").attr("class", "bars");
              gEnter.append("g").attr("class", "x axis");
              gEnter.append("g").attr("class", "brush");
            }
            // Update the outer dimensions.
            svg .attr("width", width)
                .attr("height", height)
                ;
                
            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Update the bars.
            var bar = svg.select(".bars").selectAll(".bar").data(data);
                bar.enter().append("rect").attr('class','bar');
                bar.exit().each(function(){
                    d3.select(this)
                      .transition()
                      .duration(1000)
                      .attr('width',0)
                      .attr('height',0)
                      .style('opacity',0)
                      .each('end',function(d){
                        d3.select(this).remove();
                      })
                  //console.log()
                });
                bar
                    .transition()
                    .duration(1000)
                    .attr("width", x.rangeBand())
                    .attr("x", function(d) { return x(d.x); })
                    .attr("y", function(d) { return y(d.y); })
                    .attr("height", function(d) { return y.range()[0] - y(d.y); })
                    

            // Update the x-axis.
              g.select(".x.axis")
                  .attr("transform", "translate(0," + y.range()[0] + ")")
                  .transition()
                  .duration(1000)
                  .call(xAxis);


            brushg = svg.select('.brush')
                                .call(brush);

                   

                    brushg.selectAll("rect")
                        .attr("height", height-20);
          });

          d3.select(window).on('resize.'+containerId, chart.resize)


        }

        chart.margin = function(_) {
          if (!arguments.length) return margin;
          margin = _;
          return chart;
        };
        chart.containerId = function(_){
          if(!arguments.length) return containerId;
          containerId = _;
          return chart;
        }

        chart.width = function(_) {
          if (!arguments.length) return width;
          width = _;
          return chart;
        };
        chart.minMax = function(_) {
          if (!arguments.length) return minMax;
          minMax = _;
          return chart;
        };

        chart.height = function(_) {
          if (!arguments.length) return height;
          height = _;
          return chart;
        };
        chart.brushCallBck = function(_){
          brushCallBck = _;
          return chart;
        }
        chart.resize = function(_){
          d3.select(containerId).select('svg').datum(rawData).call(chart);
        }

        function brushmove() {
                        
                            b = brush.extent();
                            defaultBushExtent = b;
                        var localBrushStart = Math.ceil((b[0])),
                            localBrushEnd = Math.ceil((b[1]));
                           
                        d3.selectAll("rect.bar").style("opacity", function(d, i) {
                          return x(d.x)>= localBrushStart && x(d.x) < localBrushEnd || brush.empty() ? 1 : 0.2;
                        });
                        
                        brushCallBck([x_rev(b[0]),x_rev(b[1])]);

                    }

        // Expose the histogram's value, range and bins method.
        d3.rebind(chart, histogram, "value", "range", "bins");

        // Expose the x-axis' tickFormat method.
        d3.rebind(chart, xAxis, "tickFormat");

        return chart;
      }
})()
