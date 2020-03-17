import React, { useEffect, useContext} from 'react';
import { useTranslation } from 'react-i18next';
import KamandAutoComplete from '../../lib/components/KamandAutoComplete';
import UpIcon from '@material-ui/icons/ArrowForward';
import SelectMeIcon from '@material-ui/icons/Check';
import Chip from '@material-ui/core/Chip';
import { AppStoreContext } from '../../lib/store/appStore';
import { observer } from 'mobx-react-lite';
import DataView from '../../lib/components/DataView';
import { fatrim } from '../../lib/utils/farsiUtils';

function getSearchText(suggestion: any) {
  if(!suggestion) return '';
  return `${fatrim(suggestion.code)}${fatrim(suggestion.name)}`;
}

function makeupData(suggestions: any): any {
  if(Array.isArray(suggestions)){
    for(let i = suggestions.length - 1; i >= 0; i--){
      const row = suggestions[i];
      row.__search_text = getSearchText(row);
      for(let j = i - 1; j >= 0; j--){
        const parent = suggestions[j];
        if(row.parentId === parent.id){
          row.__parent = parent;
          if(!parent.__children){
            parent.__children = [row];
          }else{
            parent.__children.unshift(row);
          }
          break;
        }
      }
    }
  }

  return suggestions;
}

function getSuggestionValue(suggestion: any) {
  return suggestion.id;
}

function getSuggestionDescription(suggestion: any) {
  return !suggestion || !suggestion.name ? '' : suggestion.name;
}

function getSuggestionRow(suggestion: any) {
  if(!suggestion) return null;
  const {code, name, level, leaf, isParent} = suggestion;

  if(isParent){
    return (
      <>
        <UpIcon style={{position: 'absolute', right: 0, top: 'calc(50% - 14px)'}}/>
        <div style={{textIndent: 50, color: 'grey'}}>{code} - {name}</div>
      </>)
  }

  return <>
    <div data-for="item" style={{textIndent: (+level - 1) * 10}}>{code} - {name}</div>
    {!leaf && <SelectMeIcon data-for="selectMe"/>}
  </>
}

function filterValueOptions(options: any[], inputValue: string): any[]{
  inputValue = fatrim(inputValue);
  if(!inputValue || inputValue.toString().length < 3) return options;
  const filtered = options.filter(row => {
    return row.__search_text.indexOf(inputValue) > -1
  });

  const suggestions = [] as any[];
  for(let i = 0; i < filtered.length; i++){
    const row = filtered[i];
    addParents(suggestions, row);
  }

  return suggestions;
}

function addParents(suggestions: any[], row: any){
  if(row.__parent){
    addParents(suggestions, row.__parent);
  }
  if(suggestions.indexOf(row)===-1)
    suggestions.push(row);
}

function isOptionParent(option: any): boolean{
  return !option.leaf;
}

function filterParentOptions(options: any[], parent: any): any[]{
  const suggestions = 
    parent ? options.filter(row => row.parentId === parent.id && row.id !== parent.id) :
      options.filter(row => row.parentId === row.id);
  if(parent) suggestions.unshift(parent);
  return suggestions;
}

export const AccField = (props: any)=>{
  const { t } = useTranslation();

  const { addNew, ...restProps } = props;

  const handleAddNew = async () => {
    console.log(`let's add new`);
    return null;
  }
  
  const translation = {
    openText: t('autoComplete.openText'),
    closeText: t('autoComplete.closeText'),
    clearText: t('autoComplete.clearText'),
    noOptionsText: t('autoComplete.noOptionsText'),
  }

  return <KamandAutoComplete
            queryKey={'acc_suggest'}
            query={'acc_list'}
            publicQuery={false}
            queryParam={{}}
            makeupData={makeupData}
            translation={translation}
            getSuggestionValue={getSuggestionValue}
            getSuggestionDescription={getSuggestionDescription}
            getSuggestionRow={getSuggestionRow}
            filterValueOptions={filterValueOptions}
            isOptionParent={isOptionParent}
            filterParentOptions={filterParentOptions}
            addNew={addNew ? handleAddNew : null}
            {...restProps}
          />
}

interface IDataIDViewProps {
  label: string,
  id: any,
  important?: boolean,
  chip?: boolean,
  span?: boolean,
  withCode?: boolean,
  handleDelete?: () => void,
}

export const AccView: React.FunctionComponent<IDataIDViewProps> = observer((props) => {
  const {id, label, important, chip, span, handleDelete, withCode} = props;

  const appStore = useContext(AppStoreContext);

  const accKey = `acc/${id}`;
  const acc = appStore.getActData(accKey);

  useEffect(() => {
    if(!acc && id){
      appStore.loadActData(accKey, `/acc/${id}`, {});
    }
  }, [accKey, id, acc, appStore]);

  const value = !acc ? '...' : (withCode ? acc.code + ' - ' : '') + acc.name;

  if(chip){
    return (
      <Chip
        label={`${label}: ${value}`}
        onDelete={handleDelete}
      />      
    );
  }else if(span){
    return <span>{`${label}: ${value}`}</span>
  }else{
    return (
      <DataView value={value} label={label} important={important} format="text"/>
    );
  }
})
