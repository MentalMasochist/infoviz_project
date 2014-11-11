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
        console.log(serializedData);


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
            console.log("php query successfull");
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
      subject_network_viz(response['subject_data']);
      author_network_viz(response['author_data']);
      // word_cloud_viz(data);  // to be competed in latter stages
      // extra_viz(data); // to be competed in latter stages
    };

    function trend_viz(data) {

      console.log(data);

      var sampleSVG = d3.select("#viz_trend")
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

    function subject_network_viz(data) {
      console.log(data)
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

    function author_network_viz(data) {
      console.log(data)
      var sampleSVG = d3.select("#viz_graph_author")
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

    function extra_viz(data) {
      var sampleSVG = d3.select("#extra")
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
