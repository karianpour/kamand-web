import React from 'react';
import { useTranslation } from 'react-i18next';
import withData, { IDataOptions } from '../../lib/containers/DataProvider';

import { withStyles, WithStyles } from '@material-ui/core';
import {
  XYPlot,
  XAxis,
  YAxis,
  // VerticalGridLines,
  // HorizontalGridLines,
  VerticalBarSeries,
  // VerticalBarSeriesCanvas,
  // DiscreteColorLegend
} from 'react-vis';
import Gauge from 'react-svg-gauge';
import { IQueryData } from '../../lib/store/interfaces/dataInterfaces';

const styles = {
  chartContainer: {
    margin: '5px 3px',
  },
};

const dataOption: IDataOptions = {
  key: 'test',
  query: 'publicQuery',
  queryParams: {year: '1397'},
  publicQuery: true,
}

const DataChart: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { classes, queryData } = props;

  if(!queryData || !queryData.data || queryData.data.length===0){
    return <p>no data</p>;
  }

  interface IChartDataRow {
    id: string, x: number, y: number,
  };

  const chartData:IChartDataRow[] = [];
  
  queryData.data.forEach((row)=>{
    const found = chartData.find( cd => cd.x === parseInt(row.month));
    if(found){
      found.y += row.count;
    }else{
      chartData.push({
        id: '00036', x: parseInt(row.month), y: row.count,
      });
    }
  });

  const yDomain = chartData.reduce(
    (res, row) => {
      return {
        max: Math.max(res.max, row.y),
        min: Math.min(res.min, row.y),
        total: res.total + row.y,
        count: res.count + 1,
      };
    },
    {max: -Infinity, min: Infinity, total: 0, count: 0}
  );

  console.log({chartData, yDomain})

  const BarSeries = VerticalBarSeries;

  let gaugeValue : number = yDomain.total / yDomain.count;
  let gaugeMin : number = yDomain.min;
  let gaugeMax : number = yDomain.max;



  return (
    <React.Fragment>
      <div dir="ltr" className={classes.chartContainer} style={{position: 'relative'}}>
        <XYPlot
          margin={{left: 75}}
          // xType="time"
          width={300}
          height={300}
          yDomain={[yDomain.min * 0.95, yDomain.max * 1.05]}
        >
          <BarSeries className="vertical-bar-series-example" data={chartData} />
          <XAxis />
          <YAxis />
        </XYPlot>
        <Gauge value={gaugeValue} min={gaugeMin} max={gaugeMax} width={400} height={320} label={t('data.gauge_label')} />
      </div>
    </React.Fragment>
  );

};

interface IProps extends WithStyles<typeof styles>{
  queryData: IQueryData,
}

export default withStyles(styles)(withData(DataChart, dataOption));
