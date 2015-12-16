

angular.module('mainApp').controller('welcomeSigmaCtrl').directive('mapInSigma', ['d3Service', '$window', function (d3Service, $window) {
    return {
        restrict: 'EA',
        scope: {
          data: '=',
        },
        link: function(scope,element,attrs) {
          d3Service.d3().then(function(d3) {
            var margin = parseInt(attrs.margin) || 20,
              barHeight = parseInt(attrs.barHeight) || 20,
              barPadding = parseInt(attrs.barPadding) || 5;

              var domain = {
                      min: {x: -120, y: -120},
                      max: {x: 14870, y: 14980}
              },
              width = 512,
              height = 512,
              bg = "https://s3-us-west-1.amazonaws.com/riot-api/img/minimap-ig.png",
              xScale, yScale, svg;

              $window.onresize = function() {
                scope.$apply();
              };

              var svg = d3.select(element[0]).append("svg").style("width",'100%').style("height",512);

              svg.append('image')
                  .attr('xlink:href', bg)
                  .attr('x', '0')
                  .attr('y', '0')
                  .attr('width', width)
                  .attr('height', height);


            //console.log(scope);

            //scope.data = [1,2];

            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              //console.log("render call source resize");
              scope.render(scope.data);
            });

            scope.$watch('data', function(newVals, oldVals) {
              //console.log("render call source data watch");
              //console.log(angular.element($window));
              return scope.render(newVals);
            }, true);

            scope.render = function(data) {

              if (!data) return;

              console.log("DETAILS RENDER");

              svg.selectAll("g").remove();

              var width = 512,
              // calculate the height
              height = 512,
              // Use the category20() scale function for multicolor support
              color = d3.scale.category20();

              // set the height based on the calculations above
              //svg.attr('height', height);

              wi = d3.scale.linear()
                  .domain([0, 3])
                  .range(["white", "steelblue"])
                  .interpolate(d3.interpolateLab);

              xScale = d3.scale.linear()
                .domain([domain.min.x, domain.max.x])
                .range([0, width]);

              yScale = d3.scale.linear()
                .domain([domain.min.y, domain.max.y])
                .range([height, 0]);

              console.log("SCOPE_RENDER: " + scope.data.show_kills + "," + scope.data.show_deaths);

              if (scope.data.show_kills) {
                console.log("DETAIL RENDER KILLS");
                var newdata;
                newdata = scope.data.kills.matches;
                newdata.sort(function(a,b) {if (a.riot_timestamp > b.riot_timestamp) return -1; else return 1;});

                svg.append("defs").append("filter")
                .attr("id","blur")
                .append("feGaussianBlur")
                .attr("stdDeviation",25);

                svg.append('svg:g').selectAll("circle")
                    .data(newdata)
                    .enter().append("svg:circle")
                        .attr('cx', function(d,i) { return xScale(d.pos_x) })
                        .attr('cy', function(d,i) { return yScale(d.pos_y) })
                        .attr('r', 40)
                        .attr('class', 'kills')
                        .style("fill","#FF0000")
                        .style("opacity",0.4)
                        .attr("filter", "url(#blur)");;


              }

              if (scope.data.show_deaths) {
                var newdata;
                newdata = scope.data.deaths.matches;
                newdata.sort(function(a,b) {if (a.riot_timestamp > b.riot_timestamp) return -1; else return 1;});

                svg.append('svg:g').selectAll("circle")
                    .data(newdata)
                    .enter().append("svg:circle")
                        .attr('cx', function(d) { return xScale(d.pos_x) })
                        .attr('cy', function(d) { return yScale(d.pos_y) })
                        .attr('r', 3)
                        .attr('class', 'kills')
                        .style("fill","#000000")
                        .style("stroke","black");
              }


            }

          });
        }
    };
}]);
