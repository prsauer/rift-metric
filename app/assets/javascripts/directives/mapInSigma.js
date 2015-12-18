
angular.module('mainApp')
.controller('MapCtrl')
.directive('mapInSigma',

        ['d3Service', '$window', 'DataService', 'ControlsData',
function (d3Service,   $window,   DataService,   ControlsData) {
    return {
        restrict: 'EA',
        scope: {
          data: '=',
        },
        link: function(scope,element,attrs,controllers) {
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
              scope.render(scope.data);
            });

            console.log("Watch scope");
            console.log(scope);

            scope.$watch('$parent.sigma_ctrl.data_watcher.sigma_deaths && $parent.sigma_ctrl.data_watcher.sigma_kills', function(newVals, oldVals) {
              console.log("deathswatcher " + newVals + "," + oldVals);
              if (newVals)
              return scope.render("1");
            }, true);

            scope.partial_render = function(data) {
              console.log("partial rendering");
              d3.selectAll(".kills").attr("opacity", (ControlsData.show_kills)?1:0);
              d3.selectAll(".deaths").attr("opacity", (ControlsData.show_deaths)?1:0);
            };

            scope.$watch('$parent.sigma_ctrl.controls_watcher', function(newVals, oldVals) {
              scope.partial_render();
            },
            true);

            scope.render = function(data) {
              console.log("Sigma Render");
              console.log(scope);

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


                svg.append("defs").append("filter")
                .attr("id","blur")
                .append("feGaussianBlur")
                .attr("stdDeviation",5);

                //var all_killdata = DataService.kills.map(function(el) {return el});
                //console.log(all_killdata);
                var allkills = [];

                for(var key in DataService.kills) {
                  allkills = allkills.concat(DataService.kills[key].map(function(e){return [e.pos_x, e.pos_y]}));
                }

                var alldeaths = [];

                for(var key in DataService.deaths) {
                  alldeaths = alldeaths.concat(DataService.deaths[key].map(function(e){return [e.pos_x, e.pos_y]}));
                }

                svg.append('svg:g').selectAll("circle")
                    .data(allkills)
                    .enter().append("svg:circle")
                        .attr('cx', function(d,i) { return xScale(d[0]) })
                        .attr('cy', function(d,i) { return yScale(d[1]) })
                        .attr('r', 40)
                        .attr('class', 'kills')
                        .style("fill","#FF0000")
                        .style("opacity",0.4)
                        .attr("filter", "url(#blur)")
                        .attr("opacity", ControlsData.show_kills ? 1 : 0);

                svg.append('svg:g').selectAll("circle")
                    .data(alldeaths)
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
