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
            //console.log(response);
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
      //trend_viz(response['trending_data']);
      //console.log(response)
      //console.log(response['subject_data'])
      subject_network_viz(response['subject_data']);
      author_network_viz(response['author_data']);
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

    function subject_network_viz(sub_data) {
  
    var diameter = 200,
    format = d3.format(",d"),
    color = d3.scale.category20c();

    var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

    var svg = d3.select("#viz_graph_subject").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

    var node = svg.selectAll(".node")
      .data(bubble.nodes(processData(sub_data))
      .filter(function(d) { return !d.children; }))
      .enter().append("g")
      .attr("class", "node")
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

    function processData(sub_data) {
      var classes = [];
      sub_data.forEach(function (d)
      {
        classes.push({packageName: d.subject_name, className: d.subject_name, value: d.count_sub});
      }
      );
        return {children: classes};
    }  
  };

    function author_network_viz() { };

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