import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Paper,
  Grid,
  Button,
  Theme,
  Typography,
  Divider,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { makeStyles, createStyles } from '@material-ui/styles';
import {
  ClassKeyOfStyles,
  ClassNameMap,
  Styles,
} from '@material-ui/styles/withStyles';
import useKamandData, { IDataOptions } from '../hooks/useKamandData';
import RefreshIcon from '@material-ui/icons/Refresh';

type WidgetStyles =
  "root" |
  "skeleton" |
  "inline" |
  "dataRow" |
  "data" |
  "actionLink" |
  "actionContent" |
  "bottomDivider" |
  "detailContainer" |
  "cellCenter" |
  "cellStart" |
  "cellRight" |
  "refresh";

export type WidgetClasses = ClassNameMap<ClassKeyOfStyles<Styles<Theme, {}, WidgetStyles>>>;

const useStyles = makeStyles((theme: Theme) => createStyles<WidgetStyles, {}>({
  root: {
    // minHeight: 100,
    // display: 'flex',
    // flexDirection: 'column',
    padding: 10,
  },
  skeleton: {
    // flex: 1,
    // margin: 10,
  },
  inline: {
    display: 'inline-block',
  },
  dataRow: {
    padding: 10,
  },
  data: {
    marginLeft: '0.4em',
    marginRight: '0.4em',
    boxSizing: 'border-box',
  },
  actionLink: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  actionContent: {
    color: theme.palette.primary.contrastText,
    // padding: 3,
  },
  bottomDivider: {
    height: '1em',
    marginTop: '0.2em',
    marginBottom: '0.2em',
  },
  detailContainer: {
    maxHeight: 200,
    overflowY: 'auto'
  },
  cellCenter: {
    flip: false,
    textAlign: 'left',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    // border: '1px solid grey',
  } as any,
  cellStart: {
    flip: false,
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingLeft: 8,
    paddingRight: 8,
    // border: '1px solid grey',
  } as any,
  cellRight: {
    flip: false,
    textAlign: 'right',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingLeft: 8,
    // border: '1px solid grey',
  } as any,
  refresh: {
    padding: 0,
  },
}));

const StatWidget: React.FunctionComponent<WidgetProps> = observer((props) => {
  const classes = useStyles();
  // const [data, setData] = useState(false);
  const { title, idKey, dataOptions, expandable, RowComponent, ActionComponent } = props;

  const { queryData, refreshHandler } = useKamandData(dataOptions);

  const [ subTree, setSubTree ] = useState<{[key: string]: boolean}>({});

  const handleExpland = (id: string) => {
    return ()=>{
      const value = !subTree[id];
      setSubTree({...subTree, [id]: value});
    }
  }

  if(!queryData) return null;

  return (
    <Paper className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={9}>
          <Typography>{title}</Typography>
        </Grid>
        <Grid item xs={3}>
          {!queryData.loading && <Button className={classes.refresh} onClick={refreshHandler}><RefreshIcon/></Button>}
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
        {!queryData.error && queryData.loading && <Grid item xs={12} className={classes.dataRow}><Skeleton /></Grid>}
        {!queryData.error && !queryData.loading && queryData.data && queryData.data.map( (td, index) => {
          const rowKey = idKey ? td[idKey] : index;
          const handleClick = handleExpland(rowKey);
          const expandableRow = typeof expandable === 'function' ? expandable(td) : expandable;
          return (
          <Grid key={rowKey} item container spacing={0} xs={12} className={classes.dataRow}>
            {expandableRow && <Grid item xs={1} onClick={handleClick}>
              {subTree[rowKey] ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
            </Grid>}
            <Grid item container spacing={0} xs={expandableRow ? 11 : 12}>
              <RowComponent data={td} expanded={subTree[rowKey]} onExpand={handleClick} classes={classes}/>
            </Grid>
          </Grid>
        )})}
        {queryData.error && (
          <Grid item xs={12}>
            error
          </Grid>
        )}
        <Grid item xs={12} className={classes.bottomDivider}>
          <Divider/>
        </Grid>
        {ActionComponent && <ActionComponent classes={classes}/>}
      </Grid>
    </Paper>
  )
})

interface WidgetProps {
  title: string,
  dataOptions: IDataOptions,
  idKey?: string,
  expandable?: boolean | ((data:any)=>boolean),
  RowComponent: React.FunctionComponent<WidgetRowProps>,
  ActionComponent?: React.FunctionComponent<WidgetActionProps>,
}

export interface WidgetRowProps {
  data: any,
  classes: WidgetClasses,
  expanded?: boolean,
  onExpand?: ()=>void,
}

export interface WidgetActionProps {
  classes: WidgetClasses,
}

export default StatWidget;

interface StatRowDetailProps {
  dataOptions: IDataOptions,
  idKey?: string,
  expandable?: boolean | ((data:any)=>boolean),
  RowComponent: React.FunctionComponent<WidgetRowProps>,
}

export const StatRowDetail: React.FunctionComponent<StatRowDetailProps> = observer((props) => {
  const classes = useStyles();
  const { dataOptions, idKey, expandable, RowComponent } = props;

  const { queryData, refreshHandler } = useKamandData(dataOptions);

  const [ subTree, setSubTree ] = useState<{[key: string]: boolean}>({});

  const handleExpland = (id: string) => {
    return ()=>{
      const value = !subTree[id];
      setSubTree({...subTree, [id]: value});
    }
  }

  if(!queryData) return null;

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Divider/>
      </Grid>
      <Grid item xs={3}>
        {!queryData.loading && <Button className={classes.refresh} onClick={refreshHandler}><RefreshIcon/></Button>}
      </Grid>
      <Grid item xs={12}>
        <Divider/>
      </Grid>
      {!queryData.error && queryData.loading && <Grid item xs={12} className={classes.dataRow}><Skeleton /></Grid>}
      {!queryData.error && !queryData.loading && queryData.data && queryData.data.map( (td, index) => {
        const rowKey = idKey ? td[idKey] : index;
        const handleClick = handleExpland(rowKey);
        const expandableRow = typeof expandable === 'function' ? expandable(td) : expandable;
        return (
          <Grid key={rowKey} item container spacing={0} xs={12} className={classes.dataRow}>
            {expandableRow && <Grid item xs={1} onClick={handleClick}>
              {subTree[rowKey] ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
            </Grid>}
            <Grid item container spacing={0} xs={expandableRow ? 11 : 12}>
              <RowComponent data={td} expanded={subTree[rowKey]} onExpand={handleClick} classes={classes}/>
            </Grid>
          </Grid>
      )})
      }
      
      {queryData.error && (
        <Grid item xs={12}>
          error
        </Grid>
      )}
      <Grid item xs={12} className={classes.bottomDivider}>
        <Divider/>
      </Grid>
    </React.Fragment>
  )
})

