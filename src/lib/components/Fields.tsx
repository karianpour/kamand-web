import React from 'react';

import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { DecimalInput, NumberInput } from 'react-hichestan-numberinput';
import { DateTimeInput, DateInput } from 'react-hichestan-datetimepicker';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import {FormControlLabel, FormHelperText, FormControl, Grow, Grid} from '@material-ui/core';
import { FormFieldProps } from '../hooks/useKamandForm';

export const TextKamandField = ({
  value,
  ...props
}:({inputProps?: any} & TextFieldProps)) => {
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  return (
    <TextField
      variant='standard'
      value={value}
      {...props}
    />
)};

export const DecimalKamandField = ({
  value,
  inputProps,
  ...props
}:({inputProps?: any} & TextFieldProps)) => {
  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  // a bug in material-ui, it should be done by them
  const shrink = !!value || value===0;

  return (
    <TextField
      value={value}
      {...props}
      InputLabelProps={shrink ? {shrink} : {}}
      InputProps={{
        inputComponent: DecimalInput,
        inputProps,
      }}
    />
)};

export const NumberKamandField = ({
  value,
  inputProps,
  ...props
}:({inputProps?: any} & TextFieldProps)) => {
  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const shrink = !!value || value===0;

  return (
    <TextField
      value={value}
      {...props}
      InputLabelProps={shrink ? {shrink} : {}}
      InputProps={{
        inputComponent: NumberInput,
        inputProps,
      }}
    />
)};

export const DateTimeKamandField = ({
  value,
  inputProps,
  ...props
}:({inputProps?: any} & TextFieldProps)) => {
  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const shrink = !!value;

  return (
    <TextField
      value={value}
      {...props}
      InputLabelProps={shrink ? {shrink} : {}}
      InputProps={{
        inputComponent: DateTimeInput,
        inputProps,
      }}
    />
)};

export const DateKamandField = ({
  value,
  inputProps,
  ...props
}:({inputProps?: any} & TextFieldProps)) => {
  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const shrink = !!value;

  return (
    <TextField
      value={value}
      {...props}
      InputLabelProps={shrink ? {shrink} : {}}
      InputProps={{
        inputComponent: DateInput,
        inputProps,
      }}
    />
)};

export const BooleanKamandField = ({
  id,
  onChange,
  value,
  name,
  label,
  error,
  helperText,
  inputProps,
  ...props
}:({id?: string, inputProps?: SwitchProps, label?: string} & FormFieldProps)) => {

  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  
  return (
    <FormControl
      error={error}
    >
      <FormControlLabel
        {...props}
        label={label}
        control={
          <Switch
            {...inputProps}
            name={name}
            onChange={onChange}
            checked={value}
            value={name}
          />
        }
      />
      {helperText && (
        <FormHelperText id={helperTextId}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
};

export const SelectKamandField = ({
  value,
  children,
  inputProps,
  onChange,
  name,
  ...props
}:({inputProps?: any, children: React.ReactNode} & TextFieldProps)) => {
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
    name={name}
    InputLabelProps={shrink ? {shrink} : {}}
    InputProps={{
      inputComponent: (props: any)=> (
        <Select
          fullWidth
          value={value}
          onChange={onChange}
          name={name}
          {...inputProps}
          // renderValue={value => `⚠️  - ${value}`}
        >
          {children}
        </Select>
      ),
    }}
  />
)};




