

    $(document).ready( function() {

      // variable to hold request
      var request;
      
      $("#form_menu").submit(function(event){


        if (request) {
          request.abort();
        }

        var $form = $(this);
    
        // let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");

        var serializedData = $form.serialize();

        $inputs.prop("disabled", true);

        // fire off the request to /form.php
        request = $.ajax({
            url: "query.php",
            type: "post",
            data: serializedData,
            dataType: "JSON"
        });

        var ret;
        // callback handler that will be called on success
        request.done(function (response, textStatus, jqXHR){
            // log a message to the console
            main_viz(response);
        });

        // callback handler that will be called on failure
        request.fail(function (jqXHR, textStatus, errorThrown){
            // log the error to the console
            console.error(
                "The following error occured: "+
                textStatus, errorThrown
            );
        });

        // callback handler that will be called regardless
        // if the request failed or succeeded
        request.always(function () {
            // reenable the inputs
            $inputs.prop("disabled", false);
        });
        // prevent default posting of form
        event.preventDefault();

        });
      });
  
    function main_viz(response) {
      
      d3.select("#viz_trend").select("svg").remove();
      d3.select("#viz_graph_subject").select("svg").remove();
      d3.select("#viz_graph_author").select("svg").remove();
      
      var id = 'viz_trend';
      var dim = get_dim(id),
          width = dim[0],
          height = dim[1];

      trend_viz(response['trending_data'], width, height);
     
      var id = 'viz_graph_author';
      var dim = get_dim(id),
          width = dim[0],
          height = dim[1];
      
      subject_network_viz(response['subject_data'], width, height);
      
      var id = 'viz_graph_subject';
      var dim = get_dim(id),
          width = dim[0],
          height = dim[1];

      author_network_viz(response['author_data'], width, height);

      // word_cloud_viz(data);  // to be competed in latter stages
      // extra_viz(data); // to be competed in latter stages
    };

    function get_dim(id) {
      var w = window, d = document, e = d.documentElement,
          g = d.getElementById(id),
          width = Math.min(w.innerWidth, e.clientWidth, g.clientWidth),
          height = Math.min(w.innerHeight, e.clientHeight, g.clientHeight);
      return [width,height];
    };

    function trend_viz(response, width, height) {

      var margin = {top: 20, right: 50, bottom: 30, left: 70},
          width = width - margin.left - margin.right,
          height = height - margin.top - margin.bottom;

      // var parseDate = d3.time.format("%d-%b-%y").parse;
      var parseDate = d3.time.format("%Y-%d").parse;

      var x = d3.time.scale()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.freq); });

      var svg = d3.select("#viz_trend").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        root = response;
        root.forEach(function(d) {
          d.date = parseDate(d.date);
          d.freq = +d.freq;
        });

        x.domain(d3.extent(root, function(d) { return d.date; }));
        y.domain(d3.extent(root, function(d) { return d.freq; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.append("path")
            .datum(root)
            .attr("class", "line")
            .attr("d", line);
      };

    function subject_network_viz(response, width, height) {

      function click(d) {
        console.log(d.className);
        document.getElementById('subjects').value += ',' + d.className;
        //console.log(document.getElementById('subjects').value);
        };

        function reset() {
          
        }

      var min_dim = Math.min(width,height);
      var max_dim = Math.max(width,height);

      var margin = {top: Math.ceil(0.01*height) + Math.ceil(Math.max(height-width,0)/2), 
                    right: Math.ceil(0.01*width), 
                    bottom: Math.ceil(0.01*height), 
                    left: Math.ceil(0.01*width) + Math.ceil(Math.max(width-height,0)/2)},
          width = width,
          height = height;

      // var diameter = 200,
      var diameter = min_dim - Math.ceil(min_dim*0.01)*2,
      format = d3.format(",d"),
      color = d3.scale.category20c();

      var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

      var svg = d3.select("#viz_graph_subject").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bubble")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var node = svg.selectAll(".node")
        .data(bubble.nodes(processData(response))
        .filter(function(d) { return !d.children; }))
        .enter().append("g")
        .attr("class", "node")  
        .on("click", function(d){click(d)})
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      node.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });

      node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.packageName); });

      node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

      function processData(response) {
        var classes = [];
        response.forEach(function (d){
            classes.push({packageName: d.subject_name, className: d.subject_name, value: d.count_sub});
          }
        );
          return {children: classes};
      }  
    };

    function author_network_viz(response, width, height) { 

      var zoom = d3.behavior.zoom()
        .scaleExtent([0.001, 10])
        .on("zoom", zoomed);

      var drag = d3.behavior.drag()
          .origin(function(d) { return d; })
          .on("dragstart", dragstarted)
          .on("drag", dragged)
          .on("dragend", dragended);

      var min_dim = Math.min(width,height);
      var max_dim = Math.max(width,height);

      var margin = {top: Math.ceil(0.01*height) + Math.ceil(Math.max(height-width,0)/2), 
                    right: Math.ceil(0.01*width), 
                    bottom: Math.ceil(0.01*height), 
                    left: Math.ceil(0.01*width) + Math.ceil(Math.max(width-height,0)/2)},
          width = width,
          height = height;

      var fill = d3.scale.category20();

      var svg = d3.select("#viz_graph_author")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

      var rect = svg.append("rect")
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
          .style("pointer-events", "all");

      var container = svg.append("g");

        json = response;  

        json.links.forEach(function(d) {
          d['source'] = (+d['source']) -1;
          d['target'] = (+d['target']) -1;
          d['value'] = +d['value'];
        });

        json.nodes.forEach(function(d) {
          d['nodeSize'] = +d['nodeSize'];
        });

        var force = d3.layout.force()
            .charge(-200)
            .linkDistance(40) 
            .nodes(json.nodes)
            .links(json.links)
            .size([Math.ceil(0.25*width), Math.ceil(height)])
            .start();

            // .gravity(0.6)
            // .friction(0.5)
            // .theta(0.4)

        var link = container.selectAll("line.link")
            .data(json.links)
            .enter().append("svg:line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); })
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        var node = container.selectAll("g.node")
            .data(json.nodes)
            .enter().append("svg:g")
            .attr("class", "node")

          node.append("svg:circle")
            .attr("r", 3)
              .style("fill", function(d) { return fill(d.group); })
          .call(force.drag).on("mouseover", fade(.1)).on("mouseout", fade(1));
            //.call(force.drag);

       var linkedByIndex = {};
          json.links.forEach(function(d) {
              linkedByIndex[d.source.index + "," + d.target.index] = 1;
          });

          function isConnected(a, b) {
              return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
          }

          function fade(opacity) {
              return function(d) {
                  node.style("stroke-opacity", function(o) {
                      thisOpacity = isConnected(d, o) ? 1 : opacity;
                      this.setAttribute('fill-opacity', thisOpacity);
                      return thisOpacity;
                  });

                  link.style("stroke-opacity", function(o) {
                      return o.source === d || o.target === d ? 1 : opacity;
                  });
              };
          }
          
        node.append("svg:text")
          .attr("class", "nodetext")
          .attr("dx", 10)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

        node.append("svg:title")
          .text(function(d) { return d.name; });

        container.style("opacity", 1e-6)
          .transition()
            .duration(1000)
            .style("opacity", 1);

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
          
          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });


        function zoomed() {
          container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        function dragstarted(d) {
          d3.event.sourceEvent.stopPropagation();
          d3.select(this).classed("dragging", true);
        }

        function dragged(d) {
          d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        }

        function dragended(d) {
          d3.select(this).classed("dragging", false);
        }
    };


    function word_cloud_viz(data) {
      var sampleSVG = d3.select("#viz_word_cloud")
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%");    

      sampleSVG.append("circle")
          .style("stroke", "gray")
          .style("fill", "white")
          .attr("r", 40)
          .attr("cx", 50)
          .attr("cy", 50)
          .on("mouseover", function(){d3.select(this).style("fill", "grey");})
          .on("mouseout", function(){d3.select(this).style("fill", "white");});
    };

    function extra_viz() {  };
