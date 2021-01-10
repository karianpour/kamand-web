import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExportIcon from '@material-ui/icons/CloudDownload';
import { exportPaginatedDataToCsv } from '../utils/csvExport';
import { PaginatedQueryData } from '../store/appStore';

const CsvExporter: React.FC<{filename?: string, queryData: PaginatedQueryData}> = ({filename, queryData}) => {
  const [progress, setProgress] = React.useState({ exporting: false, proceed: 0, total: 0 });

  const doProgress = React.useCallback((proceed: number, total: number, done?: boolean) => {
    if(done){
      setProgress(r => ({...r, exporting: false}));
    }else{
      setProgress(r => ({...r, proceed, total}));
    }
  }, [setProgress]);

  const exportHandler = () => {
    if(queryData.currentPage?.data?.length){
      setProgress(r => ({...r, exporting: true, total: 1}));
      exportPaginatedDataToCsv(queryData.suggestFilename(), queryData, doProgress);
    }
  }

  return <>
    {!progress.exporting && <Button onClick={exportHandler}><ExportIcon/></Button>}
    {progress.exporting && <CircularProgress variant="determinate" value={progress.proceed / progress.total}  />}
  </>
}

export default CsvExporter;