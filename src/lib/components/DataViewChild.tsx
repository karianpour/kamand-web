import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

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
}));

interface IDataViewChildProps {
  label: string,
  className?: string,
  inline?: boolean,
  span?: boolean,
}

const DataViewChild: React.FunctionComponent<IDataViewChildProps> = (props) =>{
  const {label, className, inline, span, children} = props;
  const classes = useStyles();

  if(span){
    return <span>{`${label}: `}{children}</span>
  }else{
    const classNames = inline || className ? {className: (className ? className: '') +(!inline ? '' : ' '+ classes.inline)} : undefined;
    return (
      <div {...classNames}><span className={classes.label}>{label} :</span> {children}</div>
    );
  }
}


export default DataViewChild;