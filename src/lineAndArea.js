import {
  axisBottom,
  axisLeft,
  csv,
  curveBasis,
  extent,
  format,
  line,
  scaleLinear,
  scaleTime,
  select,
  timeFormat,
} from 'd3'

export default (id, src) => {
  const svg = select(id)
  const width = window.innerWidth
  const height = window.innerHeight
  const limit = 200

  svg.attr('width', width)
  svg.attr('height', height)

  const render = (data) => {
    const title = `Amazon Stock Historical Data`
    const margin = { top: 70, right: 50, bottom: 100, left: 130 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
    g.append('text')
      .attr('y', -25)
      .attr('x', innerWidth / 2)
      .attr('text-anchor', 'middle')
      .text(title)

    const xAxisLabel = 'Time'
    const xScale = scaleTime()
      .domain(extent(data, ([_, d]) => d))
      .range([0, innerWidth])
    const xAxis = axisBottom(xScale)
      .tickFormat(timeFormat('%b %y'))
      .tickSize(-innerHeight)
      .tickPadding(15)
    const xAxisG = g
      .append('g')
      .call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`)
    xAxisG.select('.domain').remove()
    xAxisG
      .append('text')
      .attr('y', 75)
      .attr('x', innerWidth / 2)
      .attr('text-anchor', 'middle')
      .text(xAxisLabel)

    const yAxisLabel = 'Price'
    const yScale = scaleLinear()
      .domain(extent(data, ([d]) => d))
      .range([innerHeight, 0])
      .nice()
    const yAxis = axisLeft(yScale)
      .tickFormat(format('.2s'))
      .tickSize(-innerWidth)
      .tickPadding(15)
    const yAxisG = g.append('g').call(yAxis)
    yAxisG.select('.domain').remove()
    yAxisG
      .append('text')
      .attr('y', -80)
      .attr('x', -innerHeight / 2)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text(yAxisLabel)

    const lineGenerator = line()
      .x(([_, d]) => xScale(d))
      .y(([d]) => yScale(d))
      .curve(curveBasis)

    g.append('path')
      .attr('d', lineGenerator(data))
      .attr('fill', 'none')
      .attr('stroke', 'hsl(210, 50%, 50%)')
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
  }

  csv(src).then((days) => {
    days.length = limit

    const mappedData = days.map((day) => {
      const { columns } = days

      return {
        date: new Date(day[columns[1]]),
        close: +day[columns[5]].replaceAll(',', ''),
      }
    })

    const priceByDay = mappedData
      .map(({ close, date }) => [close, date])
      .sort((a, b) => b[1] - a[1])

    render(priceByDay)
  })
}
