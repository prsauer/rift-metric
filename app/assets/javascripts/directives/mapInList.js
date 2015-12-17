

angular.module('mainApp').controller('MapCtrl').directive('mapInList', ['d3Service', '$window', function (d3Service, $window) {
    return {
        restrict: 'EA',
        scope: {
          data: '=',
        },
        link: function(scope,element,attrs) {
          d3Service.d3().then(function(d3) {

              var image_size = element[0].clientWidth;

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

            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              scope.render(scope.data);
            });

            scope.$watch('data', function(newVals, oldVals) {
              return scope.render(newVals);
            }, true);

            scope.render = function(data) {

              if (!data) return;

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

              if (scope.data.controls.show_kills) {
                var newdata = scope.data.kills.matches.filter(function(d) {return d.match_id == attrs.matchid;})
                var kill_cords = newdata.map(function(d) {return [d.pos_x, d.pos_y]});

                svg.append('svg:g').selectAll("circle")
                    .data(kill_cords)
                    .enter().append("svg:circle")
                        .attr('cx', function(d) { return xScale(d[0]) })
                        .attr('cy', function(d) { return yScale(d[1]) })
                        .attr('r', 3)
                        .attr('class', 'kills')
                        .style("fill","#FFFFFF")
                        .style("stroke","black");
              }

              if (scope.data.controls.show_deaths) {
                var newdata = scope.data.deaths.matches.filter(function(d) {return d.match_id == attrs.matchid;})
                var death_cords = newdata.map(function(d) {return [d.pos_x, d.pos_y]});

                svg.append('svg:g').selectAll("circle")
                    .data(death_cords)
                    .enter().append("svg:circle")
                        .attr('cx', function(d) { return xScale(d[0]) })
                        .attr('cy', function(d) { return yScale(d[1]) })
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
