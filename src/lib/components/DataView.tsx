import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { mapToFarsi } from '../utils/farsiUtils';
import { formatDateString, formatDateTimeString } from '../utils/dateUtils';
import { format as formatter } from "d3-format";

type Formats = 'text' | 'date' | 'number' | 'decimal' | 'timestamp' | 'id';

const useStyles = makeStyles((theme: Theme) => createStyles({
  label: {
    fontSize: '0.8em',
    color: theme.palette.grey[700],
  },
  text: {
  },
  textImportant: {
    fontWeight: 700,
  },
  inline: {
    display: 'inline-block',
  },
  ltr: {
    flip: false,
    direction: 'ltr',
  } as any,
}));

interface IDataViewProps {
  label: string,
  value: any,
  format: Formats,
  scale?: number,
  important?: boolean,
  className?: string,
  inline?:boolean,
  span?: boolean,
}

const DataView: React.FunctionComponent<IDataViewProps> = (props) =>{
  const {value, label, format, scale, important, className, inline, span} = props;
  const classes = useStyles();

  const formattedValue = formatValue(value, format, scale);

  if(span){
    return <span>{`${label}: `}<span className={(formattedValue.ltr ? ' ' + classes.ltr : '')}>{formattedValue.formattedValue}</span></span>
  }else{
    const classNames = inline || className ? {className: (className ? className: '') +(!inline ? '' : ' '+ classes.inline)} : undefined;
    return (
      <div {...classNames}><span className={classes.label}>{label} :</span> <span className={(important ? classes.textImportant : classes.text) +' '+ (formattedValue.ltr ? classes.ltr : '')}>{formattedValue.formattedValue}</span></div>
    );
  }
}

function formatValue(value: any, format: Formats, scale?: number): {formattedValue: string, ltr: boolean}{
  let formattedValue: any = '';
  let ltr = false;

  if(!value && value !== 0) return {formattedValue, ltr};


  if(format==='text'){
    formattedValue = value;
  }else if(format==='date'){
    formattedValue = mapToFarsi(formatDateString(value));
    ltr = true;
  }else if(format==='timestamp'){
    formattedValue = mapToFarsi(formatDateTimeString(value));
    ltr = true;
  }else if(format==='number'){
    formattedValue = mapToFarsi(value.toString());
    ltr = true;
  }else if(format==='decimal'){
    const decimalFormatter = getFormatter(scale);
    formattedValue = mapToFarsi(decimalFormatter(+value));
    ltr = true;
  }else{
    formattedValue = 'unknown format';
  }

  if(!formattedValue) formattedValue = '';
  return {formattedValue, ltr};
}


const formatters: {[key:number]: (n: number | {valueOf(): number;}) => string} = {};
function getFormatter(scale?: number): (n: number | {valueOf(): number;}) => string{
  if(!scale){
    scale = 0;
  }
  let f = formatters[scale];
  if(!f){
    f = formatter(`(,.${scale}f`);
    formatters[scale] = f;
  }
  return f;
}

export default DataView;