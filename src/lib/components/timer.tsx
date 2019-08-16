import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { renderDateDiff } from '../utils/dateUtils';
import { calcDateDifferences } from '../utils/dateUtils';

const useStyles = makeStyles({
  time:{
    fontSize: 12,
    '@media(max-width: 920px)':{
      fontSize: 10
    }
  }
});

const TimerSticker: React.FunctionComponent<IProps> = (props) => {
  const spanEl = useRef<HTMLSpanElement>(null);
  const { t } = useTranslation();

  const {time} = props; 

  const classes = useStyles();

  const update = ()=>{
    const now = new Date();
    const text = renderDateDiff(calcDateDifferences(now, time), t);
    if(spanEl && spanEl.current!==null) {
      spanEl.current.innerText = text;
    }
  };

  useEffect(() => {
    const interval = setInterval(update, 1000);
    update();
    return () => clearInterval(interval);
  });


  return (
    <span className={classes.time} ref={spanEl}/>
  )
  
}

interface IProps {
  time: Date,
}

export default (TimerSticker);
