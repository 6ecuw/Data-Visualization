import {
  axisBottom,
  axisLeft,
  csv,
  extent,
  format,
  scaleLinear,
  select,
} from 'd3'

export default (id, src) => {
  const svg = select(id)
  const width = window.innerWidth
  const height = window.innerHeight
  const limit = 100

  svg.attr('width', width)
  svg.attr('height', height)

  const render = (data) => {
    const title = `Wealth: Age vs. Income`
    const radius = 10
    const margin = { top: 70, right: 50, bottom: 100, left: 100 }
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

    const xAxisLabel = 'Income'
    const xScale = scaleLinear()
      .domain(extent(data, ([_, d]) => d))
      .range([0, innerWidth])
      .nice()
    const xAxis = axisBottom(xScale)
      .tickFormat(format('.2s'))
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

    const yAxisLabel = 'Age'
    const yScale = scaleLinear()
      .domain(extent(data, ([d]) => d))
      .range([innerHeight, 0])
      .nice()
    const yAxis = axisLeft(yScale).tickSize(-innerWidth).tickPadding(15)
    const yAxisG = g.append('g').call(yAxis)
    yAxisG.select('.domain').remove()
    yAxisG
      .append('text')
      .attr('y', -60)
      .attr('x', -innerHeight / 2)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text(yAxisLabel)

    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cy', ([d]) => yScale(d))
      .attr('cx', ([_, d]) => xScale(d))
      .attr('r', radius)
      .attr('fill', (_, i) => `hsl(${120 + (i * 180) / limit}, 50%, 50%)`)
      .attr('opacity', '0.5')
  }

  csv(src).then((persons) => {
    persons.length = limit

    const mappedData = persons.map((person) => {
      const { columns } = persons

      return {
        age: person[columns[0]],
        education: +person[columns[1]],
        income: +person[columns[2]],
        homeVal: +person[columns[3]],
        wealth: +person[columns[4]],
        balance: +person[columns[5]],
      }
    })

    const incomeByAge = mappedData
      .map(({ age, income }) => [age, income])
      .sort((a, b) => b[1] - a[1])

    render(incomeByAge)
  })
}
