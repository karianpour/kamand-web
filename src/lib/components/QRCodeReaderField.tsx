import {TextFieldProps} from "@material-ui/core/TextField";
import React from "react";
import {Grid, Grow} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ScannerIcon from "@material-ui/icons/CameraAlt";
import QrReader from "react-qr-reader";
import {TextKamandField} from "./Fields";

export const QRCodeReaderField = ({
                                    value,
                                    name,
                                    label,
                                    onChange,
                                    ...props
                                  }:({inputProps?: any , onChange:any}  & TextFieldProps)) => {
  const [ open, setOpen ] = React.useState(false);

  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const handleOpen = () => {
    setOpen(!open);
  }

  const handleScan = (data:string  | null) => {
    if (data) {
      // console.log(data);
      onChange({target: {name: name??'', value: data}})
      // setScanValue(data)
    }
  }

  const handleError = (err:string) => {
    console.log(err);
  }
  return (
      // <div >
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextKamandField
              value ={value}
              label = {label}
              name ={name}
              onChange ={onChange}
              {...props}
          />
        </Grid>
        <Grid item xs={3}>
          <IconButton onClick={handleOpen}><ScannerIcon color='primary'/></IconButton>
        </Grid>
        <Grow in={open} mountOnEnter timeout={500}>
          <div style={{
            position: 'absolute',
            top: 50,
            left: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${60}px`,
            marginLeft: 1,
            width: '50%',
            height: '50%',
            // transition: 'background-color 0.5s ease',
            backgroundColor: 'rgba(255, 255, 255, .9)'
          }}
               onClick={handleOpen}
          >
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '80%' }}
            />
          </div>
        </Grow>


      </Grid>
  )};
