

angular.module('mainApp').controller('MapCtrl').directive('mapInList', ['d3Service', '$window', 'DataService', 'ControlsData', function (d3Service, $window, DataService, ControlsData) {
    return {
        restrict: 'EA',
        controller: 'MapCtrl',
        controllerAs: 'mapc',
        bindToController: true,
        scope: {
          data: '=',
        },
        link: function(scope,element,attrs,controllers) {
          //console.log("mapInList LINK");

          //console.log(scope);

          d3Service.d3().then(function(d3) {

              var image_size = 55;// element[0].clientWidth;

              var margin = parseInt(attrs.margin) || 20,
                barHeight = parseInt(attrs.barHeight) || 20,
                barPadding = parseInt(attrs.barPadding) || 5;

              var domain = {
                      min: {x: -120, y: -120},
                      max: {x: 14870, y: 14980}
              },
              bg = "https://s3-us-west-1.amazonaws.com/riot-api/img/minimap-ig.png",
              xScale, yScale, svg;

              $window.onresize = function() {
                scope.$apply();
              };

              var svg = d3.select(element[0]).append("svg")
              .attr('width', image_size)
              .attr('height', image_size);

              svg.append('image')
                  .attr('xlink:href', bg)
                  .attr('x', '0')
                  .attr('y', '0')
                  .attr('width', image_size)
                  .attr('height', image_size);


            scope.partial_render = function(data) {
              //console.log("partial rendering");
              d3.selectAll(".kills").attr("opacity", (ControlsData.show_kills)?1:0);
              d3.selectAll(".deaths").attr("opacity", (ControlsData.show_deaths)?1:0);
            }

            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              scope.render(scope.data);
            });

            scope.$watch('controls_watcher', function(newVals, oldVals) {
              //console.log("controls watcher (list)")
              scope.partial_render();
            },
            true);

            scope.$watch('mapc.kills_data_ready && mapc.perfs_data_ready && mapc.deaths_data_ready', function(newVals, oldVals) {
              //console.log("WATCH data_ready: " + newVals + " : " + oldVals);
              //if (newVals != oldVals)
                return scope.render(newVals);
            }, false);

            scope.render = function(data) {

              if (!data) return;

              //console.log("Full render trig");

              svg.selectAll("circle").remove();

              // Use the category20() scale function for multicolor support
              var color = d3.scale.category20();

              // set the height based on the calculations above
              //svg.attr('height', height);

              wi = d3.scale.linear()
                  .domain([0, 3])
                  .range(["white", "steelblue"])
                  .interpolate(d3.interpolateLab);

              xScale = d3.scale.linear()
                .domain([domain.min.x, domain.max.x])
                .range([0, image_size]);

              yScale = d3.scale.linear()
                .domain([domain.min.y, domain.max.y])
                .range([image_size, 0]);

              svg.append('svg:g').selectAll("circle")
                  .data(DataService.kills[controllers.my_matchid].map(function(d) { return [d.pos_x, d.pos_y]}))
                  .enter().append("svg:circle")
                      .attr('cx', function(d) { return xScale(d[0]) })
                      .attr('cy', function(d) { return yScale(d[1]) })
                      .attr('r', 3)
                      .attr('class', 'kills')
                      .style("fill","#FFFFFF")
                      .style("stroke","black")
                      .attr("opacity", ControlsData.show_kills ? 1 : 0);

              svg.append('svg:g').selectAll("circle")
                  .data(DataService.deaths[controllers.my_matchid].map(function(d) { return [d.pos_x, d.pos_y]}))
                  .enter().append("svg:circle")
                      .attr('cx', function(d) { return xScale(d[0]) })
                      .attr('cy', function(d) { return yScale(d[1]) })
                      .attr('r', 3)
                      .attr('class', 'deaths')
                      .style("fill","#000000")
                      .style("stroke","black")
                      .attr("opacity", ControlsData.show_deaths ? 1 : 0);
            }
          });
        }
    };
}]);
