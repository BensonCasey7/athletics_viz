function scatter(options) {
  const id = '#' + options.id;
  const data = options.data;
  const xAxisLabel = options.xAxisLabel;
  const yAxisLabel = options.yAxisLabel;
  const xDomain = options.xDomain;
  const yDomain = options.yDomain;
  const xKey = options.xKey;
  const yKey = options.yKey;
  const svg_width = options.width || 1000;
  const svg_height = options.height || 500;
  const regression = options.regression || false;
  const highlightKey = options.highlightKey;
  const highlightValue = options.highlightValue || false;
  const annotations = options.annotations || false;
  const dot_radius = options.dot_radius || 4;
  const tooltip = options.tooltip || false;

  const margin = {
      top: 10,
      right: 30,
      bottom: 60,
      left: 50
    },
    width = svg_width - margin.left - margin.right,
    height = svg_height - margin.top - margin.bottom;

  var div = d3.select('body').append('div')
    .attr('class', 'scatter-tooltip')
    .style('opacity', 0);

  d3.select(id).selectAll('*').remove();
  let svg = d3.select(id)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')');

  const xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([0, width]);
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale));

  svg.append('text')
    .attr('transform',
      'translate(' + (width / 2) + ' ,' +
      (height + margin.top + 35) + ')')
    .style('text-anchor', 'middle')
    .text(xAxisLabel);

  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([height, 0]);
  svg.append('g')
    .call(d3.axisLeft(yScale));

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(yAxisLabel);

  svg.append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return xScale(d[xKey]);
    })
    .attr('cy', function (d) {
      return yScale(d[yKey]);
    })
    .attr('r', dot_radius)
    .attr('class', function (d) {
      if (highlightValue && highlightValue != 'false') {
        if (d[highlightKey] == highlightValue) {
          console.log(d);
          return 'athletics'
        } else {
          return 'understated-element'
        }
      } else {
        return 'chart-element' + (tooltip ? ' chart-element--interactive' : '');
      }
    })
    .on('mouseover', function (d, i) {
      if (tooltip == 'wins') {
        div.transition()
          .duration(100)
          .style('opacity', .9);
        div.html(d.yearID.toString() + ' ' + d.name + '<br>Wins: ' + d.W + ' | Payroll: $' + d.salary.toString().slice(0, -6) + 'M')
          .style('left', (xScale(d[xKey])) + 'px')
          .style('top', (yScale(d[yKey]) + 60) + 'px');
      } else if (tooltip == 'walks') {
        div.transition()
          .duration(100)
          .style('opacity', .9);
        div.html('Walk Rate: %' + (d.walk_rate * 100).toFixed(1) + '<br>Salary: $' + d.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
          .style('left', (xScale(d[xKey])) + 'px')
          .style('top', (yScale(d[yKey]) + 60) + 'px');
      } else if (tooltip == 'winsVsWalks') {
        div.transition()
          .duration(100)
          .style('opacity', .9);
        div.html('Walks: ' + d.BB  + '<br>Wins: ' + d.W)
          .style('left', (xScale(d[xKey])) + 'px')
          .style('top', (yScale(d[yKey]) + 60) + 'px');
      }
    })
    .on('mouseout', function (d) {
      if (tooltip == 'wins') {
        div.transition()
          .duration(100)
          .style('opacity', 0);
      } else if (tooltip == 'walks') {
        div.transition()
          .duration(100)
          .style('opacity', 0);
      } else if (tooltip == 'winsVsWalks') {
        div.transition()
          .duration(100)
          .style('opacity', 0);
      }
    });

  if (regression) {
    x_regression = data.map(d => d[xKey]);
    y_regression = data.map(d => d[yKey]);
    r = regression_line(x_regression, y_regression);
    svg.append('g')
      .append('line')
      .attr('x1', xScale(r.x1))
      .attr('y1', yScale(r.y1))
      .attr('x2', xScale(r.x2))
      .attr('y2', yScale(r.y2))
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
          [xScale(d.xValue), yScale(d.yValue)],
          [xScale(d.xValue) + d.xAdj, yScale(d.yValue) + d.yAdj]
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
        return xScale(d.xValue) + d.xAdj
      })
      .attr('y', function (d) {
        return yScale(d.yValue) + d.yAdj
      })
      .attr('dy', function (d) {
        return d.yAdj >= 0 ? '1em' : '-1.7em';
      })
      .attr('class', 'annotation-title')
      .text(function (d) {
        return d.title;
      });

    svg.append('g')
      .selectAll('text')
      .data(annotations)
      .enter()
      .append('text')
      .attr('x', function (d) {
        return xScale(d.xValue) + d.xAdj
      })
      .attr('y', function (d) {
        return yScale(d.yValue) + d.yAdj
      })
      .attr('dy', function (d) {
        return d.yAdj >= 0 ? '2.5em' : '-.5em';
      })
      .attr('class', 'annotation-text')
      .text(function (d) {
        return d.text;
      });

  }

  return {
    svg: svg,
    xScale: xScale,
    yScale: yScale
  };
}

function bar(options) {
  const id = '#' + options.id;
  const data = options.data;
  const xAxisLabel = options.xAxisLabel;
  const yAxisLabel = options.yAxisLabel;
  const xDomain = options.xDomain;
  const yDomain = options.yDomain;
  const xKey = options.xKey;
  const yKey = options.yKey;
  const svg_width = options.width || 1000;
  const svg_height = options.height || 500;

  var margin = {
      top: 10,
      right: 0,
      bottom: 110,
      left: 80
    },
    width = svg_width - margin.left - margin.right,
    height = svg_height - margin.top - margin.bottom;
  let svg = d3.select(id)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var parseTime = d3.timeParse('%d-%b-%y');

  var x = d3.scaleBand()
    .rangeRound([0, width])

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  x.domain(data.map(function (d) {
    return d[xKey];
  }));
  y.domain([0, d3.max(data, function (d) {
    return Number(d[yKey]);
  }) + 200000]);

  var div = d3.select('body').append('div')
    .attr('class', 'bar-tooltip')
    .style('opacity', 0);


  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(yAxisLabel);

  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '0em')
    .attr('transform', function (d) {
      return 'rotate(-65)'
    });

  g.append('g')
    .call(d3.axisLeft(y))


  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d, i) {
      return x.bandwidth() * i + 11;
    })
    .attr('y', function (d) {
      return y(d[yKey]);
    })
    .attr('width', x.bandwidth() - 4)
    .attr('height', function (d) {
      return height - y(d[yKey]);
    })
    .attr('class', function (d) {
      if (d.teamID == 'OAK') {
        return 'athletics athletics--interactive'
      } else {
        return 'chart-element chart-element--interactive'
      }
    })
    .on('mouseover', function (d, i) {
      div.transition()
        .duration(100)
        .style('opacity', .9);
      div.html('Wins: ' + d.W + ' | Salary: $' + d.salary.toString().slice(0, -6) + 'M' + '<br>Cost per win: $' + Math.round(d[yKey]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        .style('left', (x.bandwidth() * i + 5) + 'px')
        .style('top', (y(d[yKey]) + 60) + 'px');
    })
    .on('mouseout', function (d) {
      div.transition()
        .duration(100)
        .style('opacity', 0);
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
