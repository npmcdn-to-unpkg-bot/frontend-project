"use strict";
var rs = ReStock.default;
var { ChartCanvas, Chart, EventCapture } = rs;

var { BarSeries, LineSeries, AreaSeries, ScatterSeries, CircleMarker } = rs.series;
var { financeEODDiscontiniousScale } = rs.scale;

var { MouseCoordinates } = rs.coordinates;

var { TooltipContainer, OHLCTooltip } = rs.tooltip;
var { XAxis, YAxis } = rs.axes;
var { fitWidth, TypeChooser } = rs.helper;

var xScale = financeEODDiscontiniousScale();

class LineAndScatterChart extends React.Component {
	render() {
		var { data, type, width } = this.props;
		return (
			<ChartCanvas width={width} height={400}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName="MSFT"
					data={data}
					xAccessor={d => d.date} discontinous xScale={xScale}
					xExtents={[new Date(2012, 0, 1), new Date(2012, 2, 2)]}>
				<Chart id={1}
						yExtents={d => [d.high, d.low]}
						yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")} >
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<LineSeries yAccessor={d => d.close}/>
					<ScatterSeries yAccessor={d => d.close} marker={CircleMarker} markerProps={{ r: 3 }} />
				</Chart>
				<MouseCoordinates xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} zoom={true} pan={true} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-40, 0]}/>
				</TooltipContainer>
			</ChartCanvas>

		);
	}
}

LineAndScatterChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

LineAndScatterChart.defaultProps = {
	type: "svg",
};
LineAndScatterChart = fitWidth(LineAndScatterChart);


var parseDate = d3.time.format("%Y-%m-%d").parse;
//var parseDate = d3.time.format("%m/%d/%Y").parse;
d3.tsv("./MSFT.tsv", (err, data) => {
	/* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */
	data.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});
	/* change the type from hybrid to svg to compare the performance between svg and canvas */
	ReactDOM.render(<TypeChooser type="hybrid">{type => <LineAndScatterChart data={data} type={type} />}</TypeChooser>, document.getElementById("chart"));
});


