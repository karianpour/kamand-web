import React from 'react';
import TextField from '@material-ui/core/TextField';
import { DecimalInput as HichestanDecimalInput, NumberInput as HichestanNumberInput } from 'react-hichestan-numberinput';
import { DateTimeInput as HichestanDateTimeInput, DateInput as HichestanDateInput } from 'react-hichestan-datetimepicker';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { FormControlLabel, FormControl } from '@material-ui/core';

export const NumberInput = (props : any) => {
  const {input: {name, onChange, value, ...restInput}, meta, inputProps, ...rest} = props;
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

  return (
    <TextField
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value}
      // defaultValue={value}
      InputProps={{
        inputComponent: HichestanNumberInput,
        inputProps,
      }}
    />
  )
}

export const DecimalInput = (props : any) => {
  const {input: {name, onChange, value, ...restInput}, meta, inputProps, ...rest} = props;
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

  return (
    <TextField
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value}
      // defaultValue={value}
      InputProps={{
        inputComponent: HichestanDecimalInput,
        inputProps,
      }}
    />
  )
}

export const DateInput = (props : any) => {
  let {inputProps, value, ...rest} = props;

  if(value === undefined || value === null){
    value = '';
  }

  const shrink = !!value;

  return (
    <TextField
      {...rest}
      value={value}
      InputLabelProps={shrink ? {shrink} : {}}
      InputProps={{
        inputComponent: HichestanDateInput,
        inputProps,
      }}
    />
  )
}

export const DateTimeInput = (props : any) => {
  let {inputProps, value, ...rest} = props;

  if(value === undefined || value === null){
    value = '';
  }

  const shrink = !!value;

  return (
    <TextField
      {...rest}
      value={value}
      InputLabelProps={shrink ? {shrink} : {}}
      InputProps={{
        inputComponent: HichestanDateTimeInput,
        inputProps,
      }}
    />
  )
}

export const BooleanInput = ({
  onChange,
  value,
  label,
  inputProps,
  ...props
}:any) => {

  if(value==='false') value = false;
  value = !!value;

  return (
    <FormControl>
      <FormControlLabel
        {...props}
        label={label}
        control={
          <Switch
            {...inputProps}
            // name={name}
            onChange={(event: any) => {
              onChange({target: {value: event?.target?.checked}})
            }}
            checked={value}
            // value={name}
          />
        }
      />
    </FormControl>
  )
};


export const SelectInput = ({
  value,
  children,
  inputProps,
  onChange,
  ...props
}:any) => {
  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const shrink = !!value;

  return (
  <TextField
    // value={value}
    {...props}
    InputLabelProps={shrink ? {shrink} : {}}
    InputProps={{
      inputComponent: (props: any)=> (
        <Select
          fullWidth
          value={value}
          onChange={onChange}
          // name={name}
          {...inputProps}
          // renderValue={value => `⚠️  - ${value}`}
        >
          {children}
        </Select>
      ),
    }}
  />
)};