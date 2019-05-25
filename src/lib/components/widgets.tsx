import React from 'react';

import { FieldProps } from 'formik';
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
}:(FieldProps<any> & {label?: string, inputProps?: any})) => (
  <TextField
    label={label}
    {...field} {...props}
    helperText={(errors[field.name] && touched[field.name]) && errors[field.name]}
    error={(!!errors[field.name] && !!touched[field.name])}
    inputProps={inputProps}
  />
);

export const DecimalWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  inputProps,
  ...props
}:(FieldProps<any> & {label?: string, inputProps?: any})) => (
  <TextField
    label={label}
    {...field} {...props}
    helperText={(errors[field.name] && touched[field.name]) && errors[field.name]}
    error={(!!errors[field.name] && !!touched[field.name])}
    InputProps={{
      inputComponent: DecimalInput,
      inputProps,
    }}
  />
);

export const NumberWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  inputProps,
  ...props
}:(FieldProps<any> & {label?: string, inputProps?: any})) => (
  <TextField
    label={label}
    {...field} {...props}
    helperText={(errors[field.name] && touched[field.name]) && errors[field.name]}
    error={(!!errors[field.name] && !!touched[field.name])}
    InputProps={{
      inputComponent: NumberInput,
      inputProps,
    }}
  />
);

export const DateTimeWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  inputProps,
  ...props
}:(FieldProps<any> & {label?: string, inputProps?: any})) => (
  <TextField
    label={label}
    {...field} {...props}
    helperText={(errors[field.name] && touched[field.name]) && errors[field.name]}
    error={(!!errors[field.name] && !!touched[field.name])}
    InputProps={{
      inputComponent: DateTimeInput,
      inputProps,
    }}
  />
);

export const DateWidget = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  inputProps,
  ...props
}:(FieldProps<any> & {label?: string, inputProps?: any})) => (
  <TextField
    label={label}
    {...field} {...props}
    helperText={(errors[field.name] && touched[field.name]) && errors[field.name]}
    error={(!!errors[field.name] && !!touched[field.name])}
    InputProps={{
      inputComponent: DateInput,
      inputProps,
    }}
  />
);

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
}:(FieldProps<any> & {label?: string, children: React.ReactNode})) => (
  <TextField
    label={label}
    {...field} {...props}
    helperText={(errors[field.name] && touched[field.name]) && errors[field.name]}
    error={(!!errors[field.name] && !!touched[field.name])}
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
);