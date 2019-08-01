import React from 'react';

import { FieldProps, getIn } from 'formik';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { DecimalInput, NumberInput } from 'react-hichestan-numberinput';
import {DateTimeInput, DateInput} from 'react-hichestan-datetimepicker';
import Switch from '@material-ui/core/Switch';
import { FormControlLabel } from '@material-ui/core';

export const TextWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  inputProps,
  ...props
}:(FieldProps<any> & {label?: string, inputProps?: any})) => {
  let {value, onChange, ...restField} = field;

  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const handleChange = (a:React.ChangeEvent<any>)=>{
    // console.log({a})
    onChange(a);
  }

  const error = errors[field.name];
  const touch = getIn(touched, field.name);

  return (
  <TextField
    label={label}
    value={value}
    onChange={handleChange}
    {...restField} {...props}
    helperText={(error && touch) && error}
    error={(!!error && !!touch)}
    inputProps={inputProps}
  />
)};

export const DecimalWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  inputProps,
  ...props
}:(FieldProps<any> & {label?: string, inputProps?: any})) => {
  let {value, onChange, ...restField} = field;

  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const handleChange = (a:React.ChangeEvent<any>)=>{
    // console.log({a})
    onChange(a);
  }

  const error = errors[field.name];
  const touch = getIn(touched, field.name);

  return (
  <TextField
    label={label}
    value={value}
    onChange={handleChange}
    {...restField} {...props}
    helperText={(error && touch) && error}
    error={(!!error && !!touch)}
    InputProps={{
      inputComponent: DecimalInput,
      inputProps,
    }}
  />
)};

export const NumberWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  inputProps,
  ...props
}:(FieldProps<any> & {label?: string, inputProps?: any})) => {
  let {value, onChange, ...restField} = field;

  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const handleChange = (a:React.ChangeEvent<any>)=>{
    // console.log({a})
    onChange(a);
  }

  const error = errors[field.name];
  const touch = getIn(touched, field.name);
  
  return (
  <TextField
    label={label}
    value={value}
    onChange={handleChange}
    {...restField} {...props}
    helperText={(error && touch) && error}
    error={(!!error && !!touch)}
    InputProps={{
      inputComponent: NumberInput,
      inputProps,
    }}
  />
)};

export const DateTimeWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  inputProps,
  ...props
}:(FieldProps<any> & {label?: string, inputProps?: any})) => {
  let {value, onChange, ...restField} = field;

  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const handleChange = (a:React.ChangeEvent<any>)=>{
    // console.log({a})
    onChange(a);
  }

  const error = errors[field.name];
  const touch = getIn(touched, field.name);

  return (
  <TextField
    label={label}
    value={value}
    onChange={handleChange}
    {...restField} {...props}
    helperText={(error && touch) && error}
    error={(!!error && !!touch)}
    InputProps={{
      inputComponent: DateTimeInput,
      inputProps,
    }}
  />
)};

export const DateWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  inputProps,
  ...props
}:(FieldProps<any> & {label?: string, inputProps?: any})) => {
  let {value, onChange, ...restField} = field;

  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const handleChange = (a:React.ChangeEvent<any>)=>{
    // console.log({a})
    onChange(a);
  }

  const error = errors[field.name];
  const touch = getIn(touched, field.name);

  return (
  <TextField
    label={label}
    value={value}
    onChange={handleChange}
    {...restField} {...props}
    helperText={(error && touch) && error}
    error={(!!error && !!touch)}
    InputProps={{
      inputComponent: DateInput,
      inputProps,
    }}
  />
)};

export const BooleanWidget = ({
  field: {value, ...restField}, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  ...props
}:(FieldProps<any> & {label?: string})) => (
  <FormControlLabel
    label={label}
    control={
      <Switch
        checked={value}
        {...restField} {...props}
        value={restField.name}
      />
    }
  />
);

export const SelectWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  children,
  ...props
}:(FieldProps<any> & {label?: string, children: React.ReactNode})) => {
  let {value, onChange, ...restField} = field;

  // console.log({value, restField});
  if(value === undefined || value === null){
    // console.log('make it empty')
    value = '';
  }

  const handleChange = (a:React.ChangeEvent<any>)=>{
    // console.log({a})
    onChange(a);
  }

  const error = errors[field.name];
  const touch = getIn(touched, field.name);

  return (
  <TextField
    label={label}
    value={value}
    onChange={handleChange}
    {...restField} {...props}
    helperText={(error && touch) && error}
    error={(!!error && !!touch)}
    InputProps={{
      inputComponent: (props: any)=> (
        <Select
          fullWidth
          {...props}
          // renderValue={value => `⚠️  - ${value}`}
        >
          {children}
        </Select>
      ),
    }}
  />
)};