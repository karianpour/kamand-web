import React, { useState, useContext, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import MenuItem from '@material-ui/core/MenuItem';
// import { useTranslation } from 'react-i18next';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { AppStoreContext } from '../store/appStore';
import { IQueryData } from '../store/interfaces/dataInterfaces';
import { hash } from '../utils/generalUtils';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    '&:hover $refreshIndicator, &$focused $refreshIndicator': {
      visibility: 'visible',
    },
    focused: {},
    //TODO K1: I have to put focued class name in root class so when the component get focused
    //         it shows the refresh icon button, search for "focused" in the link bellow to 
    //         see how it works.
    //  https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/Autocomplete/Autocomplete.js
  },
  /* Styles applied to the refresh indictator. */
  refreshIndicator: {
    marginRight: -2,
    padding: 4,
    color: theme.palette.action.active,
    visibility: 'hidden',
  },
}));

const KamandAutoComplete: React.FunctionComponent<IPropsInput> = observer((props) => {
  const [value, setValue] = useState<any>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [parent, setParent] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);

  const {
    name,
    value: selectedValue,
    onChange,
    label,
    placeholder,
    queryKey,
    query,
    publicQuery,
    queryParam,
    getSuggestionValue,
    getSuggestionDescription,
    getSuggestionRow,
    translation,
    filterValueOptions,
    isOptionParent,
    filterParentOptions,
  } = props;

  const classes = useStyles();

  const appStore = useContext(AppStoreContext);

  const hashKey = queryKey + '/'+ hash(JSON.stringify(queryParam));

  useEffect(()=>{
    appStore.prepareQueryData(hashKey, query, queryParam, false, publicQuery);
  }, [appStore, hashKey, query, queryParam, publicQuery]);

  const refreshHandler = () => {
    appStore.prepareQueryData(hashKey, query, queryParam, true, publicQuery);
  }

  const suggestionData: IQueryData = appStore.getQueryData(hashKey);

  useEffect(()=>{
    if(suggestionData && suggestionData.data && selectedValue && (!value || selectedValue!==getSuggestionValue(value))){
      const newValue = suggestionData.data.find(row => getSuggestionValue(row) === selectedValue);
      setValue(newValue);
      setInputValue(getSuggestionDescription(newValue));
      // setLastSelectedValue(newValue);
    }
  }, [appStore, suggestionData, selectedValue, value, getSuggestionValue, getSuggestionDescription]);

  const handleChange = (event: any, value: any)=> {
    if(value){
      if(value.isParent){
        setParent(value.parent ? {isParent: true, ...value.parent} : null);
        setValue(null);
        setInputValue('');
        setTimeout(()=>setOpen(true), 500);
      }else{
        if(isOptionParent && isOptionParent(value)){
          setParent({isParent: true, parent, ...value});
          setValue(null);
          setInputValue('');
          setTimeout(()=>setOpen(true), 500);
        }else{
          if(onChange) onChange({target: {name, value: getSuggestionValue(value)}});
          setValue(value);
          setInputValue(getSuggestionDescription(value));
        }
      }
    }else{
      if(onChange) onChange({target: {name, value: null}});
      setValue(null);
      setInputValue('');
      if(event.type!=='change'){
        setParent(null);
      }
    }
  }

  const onInputChange = (event: React.ChangeEvent<{}>, value: any) => {
    if(!event || event.type==='change'){
      setInputValue(value);
    }
  }

  const filterOptions = (options: any[], state: FilterOptionsState): any[] => {
    let filtered = options;

    if(state.inputValue){
      filtered = filterValueOptions(filtered, state.inputValue);
    }
    if(filterParentOptions){
      filtered = filterParentOptions(filtered, parent);
    }
    return filtered;
  }

  return (
    <Autocomplete
      className={classes.root}
      onChange={handleChange}
      value={value}
      inputValue={inputValue}
      onInputChange={onInputChange}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      openText={translation.openText}
      closeText={translation.closeText}
      clearText={translation.clearText}
      noOptionsText={translation.noOptionsText}
      debug={false}
      filterOptions={filterOptions}
      options={suggestionData && (suggestionData.data || [])}
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
          label={label}
          name={name}
          placeholder={placeholder}
          fullWidth
          variant="standard"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {suggestionData && suggestionData.loading ? <CircularProgress color="inherit" size={20} /> : null}
                {!suggestionData || !suggestionData.loading ? (
                  <IconButton className={classes.refreshIndicator} onClick={refreshHandler}>
                    <RefreshIcon />
                  </IconButton>) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
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
  isOptionParent: (option: any) => boolean,
  filterParentOptions: (options: any[], parent: any) => any[],
}


export default KamandAutoComplete;