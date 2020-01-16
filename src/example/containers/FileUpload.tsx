import React, { useRef, useState } from 'react';

// import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';
import axios, { AxiosRequestConfig, CancelToken, CancelTokenSource } from 'axios';
import { executeApi } from '../../lib/api/kamandApi';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    margin: '0 10px',
    height: 440,
    overflow: 'auto',
    '@media (min-width: 920px)':{
      marginRight: 10,
    }
  },
});

const FileUpload: React.FunctionComponent<{}> = observer((props) => {
  // const { t } = useTranslation();
  const [ file, setFile ] = useState<File | null>(null);
  const [ uploading, setUploading ] = useState<boolean>(false);
  const [ uploaded, setUploaded ] = useState<boolean>(false);
  const [ percentage, setPercentage ] = useState<number>(0);
  const  cancelToken = useRef<CancelTokenSource | null>(null);

  const classes = useStyles();

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault() // Stop form submit
    if(!file) return;
    try{
      if(cancelToken.current){
        cancelToken.current.cancel();
      }
      cancelToken.current = axios.CancelToken.source();
      setUploading(true);
      setUploaded(false);
      const response = await fileUpload(file, handleProgress, cancelToken.current.token);
      console.log(response);
      setUploading(false);
      setUploaded(true);
    }catch(err){
      console.log(err);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target && e.target.files && e.target.files.length > 0 && setFile(e.target.files[0]);
  }

  const handleProgress = (e:any)=>{
    setPercentage(Math.round(e.loaded / e.total * 100));
    console.log({e});
  }

  const cancelUpload = () => {
    console.log('canceled');
    if(cancelToken.current){
      cancelToken.current.cancel();
      setFile(null);
      setUploading(false);
      setUploaded(false);
    }
  }

  return (
    <Paper className={classes.root}>
      {!uploading && !uploaded && <form onSubmit={onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={onChange}/>
        <button type="submit">Upload</button>
      </form>}
      {uploading && !uploaded && <div>
        <p>{percentage}</p>
        <button onClick={cancelUpload}>Cancel</button>
      </div>}
      {uploaded && <div>
        <p>done</p>
      </div>}
    </Paper>
  );

});

export default (FileUpload);

const fileUpload = (file: File, handleProgress: (e: any)=>void, cancelToken: CancelToken) => {
  const url = 'file/1234567';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('param1', 'data-in-form');
  formData.append('param2', 'data-in-form-2');
  const config:AxiosRequestConfig = {
    method: 'POST',
    data: formData,
    url,
    cancelToken,
    headers: {
      'content-type': 'multipart/form-data',
    },
    onUploadProgress: handleProgress,
  };
  return executeApi(config)
}