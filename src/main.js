import {
  axisBottom,
  axisLeft,
  csv,
  max,
  scaleBand,
  scaleLinear,
  select,
} from 'd3'
import './styles.css'

const svg = select('svg')
const width = window.innerWidth
const height = window.innerHeight
const limit = 10

svg.attr('width', width)
svg.attr('height', height)

const render = (data) => {
  const margin = { top: 20, right: 20, bottom: 30, left: 170 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const xScale = scaleLinear()
    .domain([0, max(data, ([_, d]) => d)])
    .range([0, innerWidth])
  const yScale = scaleBand()
    .domain(data.map(([d]) => d))
    .range([0, innerHeight])
    .padding(0.1)
  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  g.append('g').call(axisLeft(yScale))
  g.append('g')
    .call(axisBottom(xScale))
    .attr('transform', `translate(0,${innerHeight})`)

  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', ([d]) => yScale(d))
    .attr('width', ([_, d]) => xScale(d))
    .attr('height', yScale.bandwidth())
    .attr('fill', (country, i) => `hsl(${120 + (i * 180) / limit}, 50%, 50%)`)
}

csv('datasets/PopulationByCountry2020.csv').then((countries) => {
  countries.length = limit

  const mappedData = countries.map((country) => {
    const { columns } = countries

    return {
      country: country[columns[0]],
      population: +country[columns[1]],
      yearlyChange: +country[columns[2]].slice(0, -2),
      netChange: +country[columns[3]],
      density: +country[columns[4]],
      avgAge: +country[columns[8]],
      worldShare: +country[columns[10]].slice(0, -2),
    }
  })

  const populationByCountry = mappedData.map(({ country, population }) => [
    country,
    population,
  ])

  render(populationByCountry)
})
