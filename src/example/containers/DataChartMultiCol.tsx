import React from 'react';
// import { useTranslation } from 'react-i18next';
import useKamandData, { IDataOptions } from '../../lib/hooks/useKamandData';

import { makeStyles } from '@material-ui/core';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  // VerticalBarSeriesCanvas,
  // DiscreteColorLegend
} from 'react-vis';


const useStyles = makeStyles({
  chartContainer: {
    margin: '5px 3px',
  },
});

const dataOption: IDataOptions = {
  key: 'test',
  query: 'publicQuery',
  queryParams: {year: '1397'},
  publicQuery: true,
}

const DataChartMultiCol: React.FunctionComponent<IProps> = (props) => {
  // const { t } = useTranslation();
  const classes = useStyles();
  const { queryData } = useKamandData(dataOption);

  if(!queryData || !queryData.data || queryData.data.length===0){
    return <p>no data</p>;
  }


  interface IChartDataRow {
    x: string, y: number,
  };

  interface IMonthData {
    month: string,
    chartData: IChartDataRow[],
  }

  const chartData:IMonthData[] = [];
  const types: {name: string, label:string}[] = [];


  const testDataSorted = queryData.data.map( td => {
    const {...rest } = td;
    return {...rest};
  }).sort( (td1, td2) => (parseInt(td1.month) * 10000 - td1.count) - (parseInt(td2.month) * 10000 - td2.count));

  // console.log({testDataSorted})

  testDataSorted.forEach((row)=>{
    const found = types.find( t => t.name === row.type_name);
    if(!found){
      types.push({name: row.type_name, label: String.fromCharCode(65 + types.length)});
    }

    const foundMonth = chartData.find( cd => cd.month === row.month);
    if(!foundMonth){
      chartData.push({month: row.month, chartData: []});
    }
  });

  const OtherLabel = String.fromCharCode(65 + types.length);
  // console.log({types, OtherLabel})


  testDataSorted.forEach((row)=>{
    const found = chartData.find( cd => cd.month === row.month);
    const foundType = types.find( t => t.name === row.type_name);
    if(found && foundType){
      if(found.chartData.length < 2){
        found.chartData.push({x:foundType.label, y: row.count});
      }else if(found.chartData.length === 2){
        found.chartData.push({x:OtherLabel, y: row.count});
      }else{
        found.chartData[2].y += row.count;
      }
    }
  });

  // const yDomain = chartData.reduce(
  //   (res, row) => {
  //     return {
  //       max: Math.max(res.max, row.y),
  //       min: Math.min(res.min, row.y)
  //     };
  //   },
  //   {max: -Infinity, min: Infinity}
  // );

  // console.log({chartData})

  const BarSeries = VerticalBarSeries;

  return (
    <div dir="ltr" className={classes.chartContainer} style={{position: 'relative'}}>
      <XYPlot xType="ordinal" width={300} height={300} xDistance={100}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        {chartData.map((cd, index) => (
          <BarSeries key={index} data={cd.chartData} />
        ))}
        {/* <LabelSeries data={labelData} getLabel={d => d.x} /> */}
     </XYPlot>
    </div>
  );

};

interface IProps {
}

export default DataChartMultiCol;
