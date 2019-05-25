import React from 'react';
import TextField from '@material-ui/core/TextField';
import { DecimalInput as HichestanDecimalInput, NumberInput as HichestanNumberInput } from 'react-hichestan-numberinput';

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