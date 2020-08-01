function scatter(options) {
  const id = '#' + options.id;
  const data = options.data;
  const x_axis_label = options.x_axis_label;
  const y_axis_label = options.y_axis_label;
  const x_domain = options.x_domain;
  const y_domain = options.y_domain;
  const x_key = options.x_key;
  const y_key = options.y_key;
  const svg_width = options.width || 1000;
  const svg_height = options.height || 500;
  const regression = options.regression || false;
  const highlight_key = options.highlight_key;
  const highlight_value = options.highlight_value || false;
  const annotations = options.annotations || false;
  const dot_radius = options.dot_radius || 4;

  const margin = {
      top: 10,
      right: 30,
      bottom: 60,
      left: 50
    },
    width = svg_width - margin.left - margin.right,
    height = svg_height - margin.top - margin.bottom;

  d3.select(id).selectAll("*").remove();
  let svg = d3.select(id)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')');

  const x_scale = d3.scaleLinear()
    .domain(x_domain)
    .range([0, width]);
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x_scale));

  svg.append('text')
    .attr('transform',
      'translate(' + (width / 2) + ' ,' +
      (height + margin.top + 35) + ')')
    .style('text-anchor', 'middle')
    .text(x_axis_label);

  const y_scale = d3.scaleLinear()
    .domain(y_domain)
    .range([height, 0]);
  svg.append('g')
    .call(d3.axisLeft(y_scale));

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(y_axis_label);

  svg.append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return x_scale(d[x_key]);
    })
    .attr('cy', function (d) {
      return y_scale(d[y_key]);
    })
    .attr('r', dot_radius)
    .attr("class", function (d) {
      if (highlight_value && highlight_value != 'false') {
        if (d[highlight_key] == highlight_value) {
          return 'athletics'
        } else {
          return 'understated_element'
        }
      } else {
        return 'chart_element';
      }
    });

  if (regression) {
    x_regression = data.map(d => d[x_key]);
    y_regression = data.map(d => d[y_key]);
    r = regression_line(x_regression, y_regression);
    svg.append('g')
      .append('line')
      .attr('x1', x_scale(r.x1))
      .attr('y1', y_scale(r.y1))
      .attr('x2', x_scale(r.x2))
      .attr('y2', y_scale(r.y2))
      .attr('stroke-width', 5)
      .attr('opacity', .3)
      .attr('stroke', 'red');
  }

  if (annotations) {
    var lineGenerator = d3.line();
    svg.append('g')
      .selectAll('path')
      .data(annotations)
      .enter()
      .append('path')
      .attr('d', function (d) {
        return lineGenerator([
          [x_scale(d.x_value), y_scale(d.y_value)],
          [x_scale(d.x_value) + d.x_adj, y_scale(d.y_value) + d.y_adj]
        ]);
      })
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    svg.append('g')
      .selectAll('text')
      .data(annotations)
      .enter()
      .append('text')
      .attr('x', function (d) {
        return x_scale(d.x_value) + d.x_adj
      })
      .attr('y', function (d) {
        return y_scale(d.y_value) + d.y_adj
      })
      .attr('dy', function (d) {
        return d.y_adj >= 0 ? '1em' : '-1.7em';
      })
      .attr('class', 'annotation_title')
      .text(function (d) {
        return d.title;
      });

    svg.append('g')
      .selectAll('text')
      .data(annotations)
      .enter()
      .append('text')
      .attr('x', function (d) {
        return x_scale(d.x_value) + d.x_adj
      })
      .attr('y', function (d) {
        return y_scale(d.y_value) + d.y_adj
      })
      .attr('dy', function (d) {
        return d.y_adj >= 0 ? '2.5em' : '-.5em';
      })
      .attr('class', 'annotation_text')
      .text(function (d) {
        return d.text;
      });

  }

  return {
    svg: svg,
    x_scale: x_scale,
    y_scale: y_scale
  };
}

function bar(options) {
  const id = '#' + options.id;
  const data = options.data;
  const x_axis_label = options.x_axis_label;
  const y_axis_label = options.y_axis_label;
  const x_domain = options.x_domain;
  const y_domain = options.y_domain;
  const x_key = options.x_key;
  const y_key = options.y_key;
  const svg_width = options.width || 1000;
  const svg_height = options.height || 500;

  var margin = {
      top: 10,
      right: 0,
      bottom: 110,
      left: 60
    },
    width = svg_width - margin.left - margin.right,
    height = svg_height - margin.top - margin.bottom;
  let svg = d3.select(id)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%d-%b-%y");

  var x = d3.scaleBand()
    .rangeRound([0, width])

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  x.domain(data.map(function (d) {
    return d[x_key];
  }));
  y.domain([0, d3.max(data, function (d) {
    return Number(d[y_key]);
  }) + 200000]);

  var div = d3.select("body").append("div")
    .attr("class", "bar-tooltip")
    .style("opacity", 0);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "0em")
    .attr("transform", function (d) {
      return "rotate(-65)"
    });

  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text(y_axis_label);

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d, i) {
      return x.bandwidth() * i + 5;
    })
    .attr("y", function (d) {
      return y(d[y_key]);
    })
    .attr("width", x.bandwidth() - 4)
    .attr("height", function (d) {
      return height - y(d[y_key]);
    })
    .attr("class", function (d) {
      if (d.teamID == 'OAK') {
        return 'athletics athletics--interactive'
      } else {
        return 'chart_element chart_element--interactive'
      }
    })
    .on("mouseover", function (d, i) {
      div.transition()
        .duration(100)
        .style("opacity", .9);
      div.html('Wins: ' + d.W + '<br>Salary: $' + d.salary )
        .style("left", (x.bandwidth() * i + 5) + "px")
        .style("top", (y(d[y_key]) - 20) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(100)
        .style("opacity", 0);
    });
}

function regression_line(values_x, values_y) {
  let x_sum = 0;
  let y_sum = 0;
  let xy_sum = 0;
  let xx_sum = 0;
  let count = 0;

  let x = 0;
  let y = 0;
  let values_length = values_x.length;

  if (values_length != values_y.length) {
    throw new Error('The parameters values_x and values_y need to have same size!');
  }

  if (values_length === 0) {
    return [
      [],
      []
    ];
  }

  for (let i = 0; i < values_length; i++) {
    x = values_x[i];
    y = values_y[i];
    x_sum += x;
    y_sum += y;
    xx_sum += x * x;
    xy_sum += x * y;
    count++;
  }

  let m = (count * xy_sum - x_sum * y_sum) / (count * xx_sum - x_sum * x_sum);
  let b = (y_sum / count) - (m * x_sum) / count;

  let result_values_x = [];
  let result_values_y = [];

  for (let i = 0; i < values_length; i++) {
    x = values_x[i];
    y = x * m + b;
    result_values_x.push(x);
    result_values_y.push(y);
  }
  return {
    x1: Math.min.apply(Math, result_values_x),
    y1: Math.min.apply(Math, result_values_y),
    x2: Math.max.apply(Math, result_values_x),
    y2: Math.max.apply(Math, result_values_y)
  };
}
