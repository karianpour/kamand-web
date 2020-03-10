import React, { useState, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
// import { useTranslation } from 'react-i18next';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
  },
  inputRoot: { // if material design add the `important` tag we can remove this class
    '& $input': {
      width: '0 !important',
    },
  },
}));

const KamandStaticAutoComplete: React.FunctionComponent<IPropsInput> = observer((props) => {
  const [value, setValue] = useState<any>(null);

  const {
    name,
    value: selectedValue,
    error,
    helperText,
    onChange,
    label,
    placeholder,
    getSuggestionValue,
    getSuggestionDescription,
    getSuggestionRow,
    translation,
    filterValueOptions,
    getListSuggestions,
  } = props;

  const classes = useStyles();

  const suggestionData = getListSuggestions();

  useEffect(()=>{
    if(suggestionData && (selectedValue || (value && !selectedValue)) && (!value || selectedValue!==getSuggestionValue(value))){
      const newValue = !selectedValue ? '' : suggestionData.find(row => getSuggestionValue(row) === selectedValue);
      setValue(newValue);
    }
  }, [suggestionData, selectedValue, value, getSuggestionValue, getSuggestionDescription]);

  const handleChange = (event: any, value: any)=> {
    if(value){
      if(onChange) onChange({target: {name, value: getSuggestionValue(value)}});
      setValue(value);
    }else{
      if(onChange) onChange({target: {name, value: ''}});
      setValue('');
    }
  }

  const filterOptions = (options: any[], state: FilterOptionsState): any[] => {
    let filtered = options;
    if(state.inputValue){
      filtered = filterValueOptions(filtered, state.inputValue);
    }
    return filtered;
  }

  return (
    <Autocomplete
      className={classes.root}
      onChange={handleChange}
      value={value}
      openText={translation.openText}
      closeText={translation.closeText}
      clearText={translation.clearText}
      noOptionsText={translation.noOptionsText}
      debug={false}
      filterOptions={filterOptions}
      options={suggestionData || []}
      getOptionLabel={(option) => getSuggestionDescription(option)}
      renderOption={(option, state) => (
        <MenuItem selected={state.selected} component="div">
          {getSuggestionRow && getSuggestionRow(option)}
          {!getSuggestionRow && <span>{getSuggestionDescription(option)}</span>}
        </MenuItem>
      )}
      renderInput={params => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            className: `${params.InputProps.className} ${classes.inputRoot}`,
          }}
          label={label}
          name={name}
          error={error}
          helperText={helperText}
          placeholder={placeholder}
          fullWidth
          variant="standard"
        />
      )}
    />
  );
});

interface IPropsInput {
  value?: any,
  name?: string,
  onChange: any,
  label?: string,
  error?: boolean,
  helperText?: string,
  placeholder?: string,
  queryKey: string,
  query: string,
  publicQuery: boolean,
  queryParam: any,
  translation: {
    openText: string,
    closeText: string,
    clearText: string,
    noOptionsText: string,
  },
  getSuggestionValue: (suggection: any)=>string,
  getSuggestionDescription: (suggection: any)=>string,
  getSuggestionRow?: (suggection: any)=>Node,
  filterValueOptions: (options: any[], inputValue: string)=>any[],
  getListSuggestions: ()=>any[],
}


export default KamandStaticAutoComplete;