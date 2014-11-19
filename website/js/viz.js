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
        // console.log(serializedData);


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
            // console.log("php query successfull");
            console.log(response);
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
      trend_viz(response['trending_data']);
      author_network_viz(response['author_data']);
      // subject_network_viz(response['subject_data']);
      // word_cloud_viz(data);  // to be competed in latter stages
      // extra_viz(data); // to be competed in latter stages
    };

    function trend_viz(response) {

      // console.log("trend viz");
      console.log(typeof response);

      var margin = {top: 20, right: 50, bottom: 30, left: 70},
          width = 1125 - margin.left - margin.right,
          height = 270 - margin.top - margin.bottom;

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

      // d3.tsv("./data/trend.tsv", function(error, data) {
      //   data.forEach(function(d) {
      //     d.date = parseDate(d.date);
      //     d.freq = +d.freq;
      //   });

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

    function subject_network_viz(data) {

      var sampleSVG = d3.select("#viz_graph_subject")
          .append("svg")
          .attr("width", 100)
          .attr("height", 100);    

      sampleSVG.append("circle")
          .style("stroke", "gray")
          .style("fill", "white")
          .attr("r", 40)
          .attr("cx", 50)
          .attr("cy", 50)
          .on("mouseover", function(){d3.select(this).style("fill", "grey");})
          .on("mouseout", function(){d3.select(this).style("fill", "white");});
    };

    function author_network_viz(response) { 
        var w = 500,
            h = 334,
            fill = d3.scale.category20();

        var vis = d3.select("#viz_graph_author")
          .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .attr("transform", "translate(" + -100 + "," + 0 + ")");

        json = response;  

        json.links.forEach(function(d) {
          d['source'] = +d['source'] -1;
          d['target'] = +d['target'] -1;
          d['value'] = +d['value'];
        });


        console.log(json);
        console.log(json.links[0]);

        var force = d3.layout.force()
            .charge(-20)
            .linkDistance(20)
            .nodes(json.nodes)
            .links(json.links)
            .size([w, h])
            .start();

        var link = vis.selectAll("line.link")
            .data(json.links)
            .enter().append("svg:line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); })
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        var node = vis.selectAll("g.node")
            .data(json.nodes)
            .enter().append("svg:g")
            .attr("class", "node")

          node.append("svg:circle")
            .attr("r", 5)
              .style("fill", function(d) { return fill(d.group); })
          .call(force.drag).on("mouseover", fade(.1)).on("mouseout", fade(1));;
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

        vis.style("opacity", 1e-6)
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
