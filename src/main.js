import renderBarChart from './barChart'
import renderScatterPlot from './scatterPlot'
import './styles.css'

renderScatterPlot('#scatterPlot', 'datasets/Banking.csv')
renderBarChart('#barChart', 'datasets/PopulationByCountry2020.csv')
