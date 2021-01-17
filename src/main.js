import renderBarChart from './barChart'
import renderScatterPlot from './scatterPlot'
import renderLineAndArea from './lineAndArea'
import './styles.css'

renderLineAndArea('#lineAndArea', 'datasets/AmazonStocksHistoricalData.csv')
renderScatterPlot('#scatterPlot', 'datasets/Banking.csv')
renderBarChart('#barChart', 'datasets/PopulationByCountry2020.csv')
