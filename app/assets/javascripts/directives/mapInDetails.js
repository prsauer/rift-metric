

angular.module('mainApp')
.controller('MapCtrl')
.directive('mapInDetails',
        ['d3Service', '$window', 'ControlsData', 'DataService',
function (d3Service,   $window,   ControlsData,   DataService) {
    return {
        restrict: 'EA',
        scope: {
          data: '=',
        },
        link: function(scope,element,attrs,controllers) {
          console.log("details-Link");
          console.log(scope);
          console.log(controllers);

          d3Service.d3().then(function(d3) {
            var margin = parseInt(attrs.margin) || 20,
              barHeight = parseInt(attrs.barHeight) || 20,
              barPadding = parseInt(attrs.barPadding) || 5;

              var image_size = element[0].clientWidth;

              var domain = {
                      min: {x: -120, y: -120},
                      max: {x: 14870, y: 14980}
              },
              width = image_size,
              height = image_size,
              bg = "https://s3-us-west-1.amazonaws.com/riot-api/img/minimap-ig.png",
              xScale, yScale, svg;

              $window.onresize = function() {
                scope.$apply();
              };

              var svg = d3.select(element[0]).append("svg")
              .attr('width', width)
              .attr('height', height);

              svg.append('image')
                  .attr('xlink:href', bg)
                  .attr('x', '0')
                  .attr('y', '0')
                  .attr('width', width)
                  .attr('height', height);

            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              //console.log("render call source resize");
              scope.render(scope.data);
            });

            scope.partial_render = function(data) {
              //console.log("partial rendering");
              d3.selectAll(".kills").attr("opacity", (ControlsData.show_kills)?1:0);
              d3.selectAll(".deaths").attr("opacity", (ControlsData.show_deaths)?1:0);
            }

            scope.$watch('$parent.details_ctrl.kills_data_ready && details_ctrl.perfs_data_ready && details_ctrl.deaths_data_ready',
            function(newVals, oldVals) {
              console.log("WATCH data_ready: " + newVals + " : " + oldVals);
              //if (newVals != oldVals)
                return scope.render(" no ");
            }, false);

            scope.$watch('controls_watcher', function(newVals, oldVals) {
              scope.partial_render();
            },
            true);

            scope.render = function(data) {

              if (!data) return;

              //console.log("DETAILS RENDER");

              svg.selectAll("g").remove();

              var width = image_size,
              // calculate the height
              height = image_size,
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

              //console.log("SCOPE_RENDER: " + scope.data.show_kills + "," + scope.data.show_deaths);

              if (ControlsData.show_kills) {
                //console.log("DETAIL RENDER KILLS");
                var sorted_kills =
                        DataService.kills[scope.$parent.details_ctrl.my_matchid]
                        .sort(function(a,b) {if (a.riot_timestamp < b.riot_timestamp) return -1; else return 1;});
                console.log(sorted_kills);

                //newdata = scope.data.kills.matches.filter(function(d) {return d.match_id == attrs.matchid;})
                //newdata.sort(function(a,b) {if (a.riot_timestamp > b.riot_timestamp) return -1; else return 1;});
                console.log(DataService.kills[scope.$parent.details_ctrl.my_matchid].map(function(d) { return [d.pos_x, d.pos_y]}));

                svg.append('svg:g').selectAll("circle")
                    .data(sorted_kills.map(function(d) { return [d.pos_x, d.pos_y]}))
                    .enter().append("svg:circle")
                        .attr('cx', function(d,i) { return xScale(d[0]) })
                        .attr('cy', function(d,i) { return yScale(d[1]) })
                        .attr('r', 3)
                        .attr('class', 'kills')
                        .style("fill","#FFFFFF")
                        .style("stroke","black");

                svg.append('svg:g').selectAll("text")
                    .data(sorted_kills.map(function(d) { return [d.pos_x, d.pos_y]}))
                    .enter().append("text")
                        .attr('x', function(d,i) { return xScale(d[0]) })
                        .attr('y', function(d,i) { return yScale(d[1]) })
                        .style("fill","#FFFFFF")
                        .style("stroke","black")
                        .text(function(d,i){return i+1;})
                        .attr('font-size', 35)
              }

              if (ControlsData.show_deaths) {
                // var newdata;
                // newdata = scope.data.deaths.matches.filter(function(d) {return d.match_id == attrs.matchid;})
                // newdata.sort(function(a,b) {if (a.riot_timestamp > b.riot_timestamp) return -1; else return 1;});

                svg.append('svg:g').selectAll("circle")
                    .data(DataService.deaths[scope.$parent.details_ctrl.my_matchid].map(function(d) { return [d.pos_x, d.pos_y]}))
                    .enter().append("svg:circle")
                        .attr('cx', function(d) { return xScale(d[0]) })
                        .attr('cy', function(d) { return yScale(d[1]) })
                        .attr('r', 3)
                        .attr('class', 'deaths')
                        .style("fill","#000000")
                        .style("stroke","black");

                svg.append('svg:g').selectAll("text")
                    .data(DataService.deaths[scope.$parent.details_ctrl.my_matchid].map(function(d) { return [d.pos_x, d.pos_y]}))
                    .enter().append("text")
                        .attr('x', function(d,i) { return xScale(d[0]) })
                        .attr('y', function(d,i) { return yScale(d[1]) })
                        .style("fill","#000000")
                        .style("stroke","white")
                        .text(function(d,i){return i+1;})
                        .attr('font-size', 35)
              }


            }

          });
        }
    };
}]);
