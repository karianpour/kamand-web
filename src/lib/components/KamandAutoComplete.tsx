import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
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
      // visibility: 'visible',
      display: 'block',
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
    // visibility: 'hidden',
    display: 'none',
    // display: 'block',
  },
  inputRoot: { // if material design add the `important` tag we can remove this class
    '& $input': {
      width: '0 !important',
    },
  },
}));

const KamandAutoComplete: React.FunctionComponent<IPropsInput> = observer((props) => {
  const [value, setValue] = useState<any>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [parent, setParent] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const keepOpenRef = useRef<boolean>(false);

  const {
    name,
    value: selectedValue,
    error,
    helperText,
    onChange,
    label,
    placeholder,
    queryKey,
    query,
    publicQuery,
    queryParam,
    makeupData,
    getSuggestionValue,
    getSuggestionDescription,
    getSuggestionRow,
    translation,
    filterValueOptions,
    isOptionParent,
    filterParentOptions,
    acceptParent,
    addNew,
  } = props;

  const classes = useStyles();

  const appStore = useContext(AppStoreContext);

  const hashKey = queryKey + '/'+ hash(JSON.stringify(queryParam));

  useEffect(()=>{
    appStore.prepareQueryData(hashKey, query, queryParam, false, publicQuery, makeupData);
  }, [appStore, hashKey, query, queryParam, makeupData, publicQuery]);

  const refreshHandler = () => {
    appStore.prepareQueryData(hashKey, query, queryParam, true, publicQuery, makeupData);
  }

  const suggestionData: IQueryData = appStore.getQueryData(hashKey);

  useEffect(()=>{
    if(suggestionData && suggestionData.data && selectedValue){ // && (!value || selectedValue!==getSuggestionValue(value))
      const newValue = suggestionData.data.find(row => getSuggestionValue(row) === selectedValue);
      if(value !== newValue){
        setValue(newValue || '');
        setInputValue(getSuggestionDescription(newValue));
      }
      // setLastSelectedValue(newValue);
    }
  }, [appStore, suggestionData, selectedValue, value, getSuggestionValue, getSuggestionDescription]);

  const handleChange = useCallback((event: any, value: any)=> {
    if(value){
      if(value.isParent){
        setParent(value.parent ? {isParent: true, ...value.parent} : null);
        if(!acceptParent){
          setValue('');
          setInputValue('');
        }
        keepOpenRef.current = true;
        // setTimeout(()=>setOpen(true), 200);
      }else{
        if(isOptionParent && isOptionParent(value)){
          setParent({isParent: true, parent, ...value});
          if(acceptParent){
            if(onChange) onChange({target: {name, value: getSuggestionValue(value)}});
            setValue(value || '');
            setInputValue(getSuggestionDescription(value));
          }else{
            setValue('');
            setInputValue('');
          }
          keepOpenRef.current = true;
          // setTimeout(()=>setOpen(true), 200);
        }else{
          if(onChange) onChange({target: {name, value: getSuggestionValue(value)}});
          setValue(value);
          setInputValue(getSuggestionDescription(value));
        }
      }
    }else{
      if(onChange) onChange({target: {name, value: null}});
      setValue('');
      setInputValue('');
      if(event.type!=='change'){
        setParent(null);
      }
    }
  }, [parent, name, setValue, setInputValue, setParent, onChange, getSuggestionDescription, getSuggestionValue, keepOpenRef, isOptionParent, acceptParent])

  const onInputChange = useCallback((event: React.ChangeEvent<{}>, value: any) => {
    if(!event || event.type==='change'){
      setInputValue(value);
    }
  }, [setInputValue]);

  const filterOptions = useCallback((options: any[], state: FilterOptionsState): any[] => {
    let filtered = options;

    if(state.inputValue){
      filtered = filterValueOptions(filtered, state.inputValue);
    }
    if(filterParentOptions){
      filtered = filterParentOptions(filtered, parent);
    }
    return filtered;
  }, [parent, filterValueOptions, filterParentOptions]);

  const handleAddNew = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!addNew) return;
    const selected = await addNew(value, parent);
    if(selected){
      if(onChange) onChange({target: {name, value: getSuggestionValue(selected)}});
      refreshHandler();
    }
  }

  const handleOpen = useCallback(()=>{
    setOpen(true);
    keepOpenRef.current = false;
  }, [setOpen]);

  const handleClose = useCallback(()=>{
    if(!keepOpenRef.current){
      setOpen(false);
    }
    keepOpenRef.current = false;
  }, [setOpen, keepOpenRef])

  return (
    <Autocomplete
      className={classes.root}
      onChange={handleChange}
      value={value}
      inputValue={inputValue}
      onInputChange={onInputChange}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      openText={translation.openText}
      closeText={translation.closeText}
      clearText={translation.clearText}
      noOptionsText={translation.noOptionsText}
      debug={false}
      filterOptions={filterOptions}
      options={suggestionData?.data || []}
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
          error={error}
          helperText={helperText}
          placeholder={placeholder}
          fullWidth
          variant="standard"
          InputProps={{
            ...params.InputProps,
            className: `${params.InputProps.className} ${classes.inputRoot}`,
            endAdornment: (
              <React.Fragment>
                {suggestionData && suggestionData.loading ? <CircularProgress color="inherit" size={20} /> : null}
                {!suggestionData || !suggestionData.loading ? (
                  <IconButton className={classes.refreshIndicator} size="small" onClick={refreshHandler}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>) : null}
                {addNew ? (
                  <IconButton className={classes.refreshIndicator} size="small" onClick={handleAddNew}>
                    {value ? <EditIcon fontSize="small" /> : <AddIcon />}
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
  error?: boolean,
  helperText?: string,
  placeholder?: string,
  queryKey: string,
  query: string,
  publicQuery: boolean,
  queryParam: any,
  makeupData: (data: any)=>any,
  translation: {
    openText: string,
    closeText: string,
    clearText: string,
    noOptionsText: Node,
  },
  getSuggestionValue: (suggection: any)=>string,
  getSuggestionDescription: (suggection: any)=>string,
  getSuggestionRow?: (suggection: any)=>Node,
  filterValueOptions: (options: any[], inputValue: string)=>any[],
  isOptionParent?: (option: any) => boolean,
  filterParentOptions?: (options: any[], parent: any) => any[],
  acceptParent?: boolean,
  addNew?: (value: any, parent: any) => Promise<any>,
}


export default KamandAutoComplete;

export const AutoCompleteWithAdd = (props: any)=>{
  const { AutoCompleteFiled, EntryDialog, ...rest } = props;
  const [open, setOpen] = useState(false);
  const [parent, setParent] = useState(null);
  const [value, setValue] = useState('');

  const handleClose = () => {
    setOpen(false);
    if(resolveRef.current){
      resolveRef.current(null);
    }
  };
  
  const handleSaved = (value: any) => {
    setOpen(false);
    if(resolveRef.current){
      resolveRef.current(value);
    }
  };

  const resolveRef = useRef<any>(null);

  const handleAddNew = async (value: any, parent: any) => {
    setValue(value || '');
    setParent(parent);
    setOpen(true);
    return new Promise((resolve)=>{
      resolveRef.current = resolve;
    });
  }

  return (
    <React.Fragment>
      <AutoCompleteFiled addNew={handleAddNew} {...rest}/>
      <EntryDialog open={open} onSaved={handleSaved} onClose={handleClose} filter={{...props.filter, parent, value}}/>
    </React.Fragment>
  )
}
