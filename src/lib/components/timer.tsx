import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { renderDateDiff } from '../utils/dateUtils';
import { calcDateDifferences } from '../utils/dateUtils';

const styles = {
  time:{
    fontSize: 12,
    '@media(max-width: 920px)':{
      fontSize: 10
    }
  }
}

const TimerSticker: React.FunctionComponent<IProps> = (props) => {
  const spanEl = useRef<HTMLSpanElement>(null);
  const { t } = useTranslation();

  const {time,classes} = props; 

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

interface IProps extends WithStyles<typeof styles> {
  time: Date,
}

export default withStyles(styles)(TimerSticker);
