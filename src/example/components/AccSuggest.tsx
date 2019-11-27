import React, { useEffect, useContext} from 'react';
import { useTranslation } from 'react-i18next';
import KamandAutoComplete from '../../lib/components/KamandAutoComplete';
import UpIcon from '@material-ui/icons/ArrowForward';
import Chip from '@material-ui/core/Chip';
import { AppStoreContext } from '../../lib/store/appStore';
import { observer } from 'mobx-react-lite';
import DataView from '../../lib/components/DataView';

function getSuggestionValue(suggestion: any) {
  return suggestion.id;
}

function getSuggestionDescription(suggestion: any) {
  return !suggestion || !suggestion.name ? '' : suggestion.name;
}

function getSuggestionRow(suggestion: any) {
  if(!suggestion) return null;
  const {code, name, level, isParent} = suggestion;

  if(isParent){
    return (
      <div>
        <UpIcon style={{position: 'absolute', right: 0, top: 'calc(50% - 14px)'}}/>
        <div style={{textIndent: 50, color: 'grey'}}>{code} - {name}</div>
      </div>)
  }

  return <div style={{textIndent: (+level - 1) * 10}}>{code} - {name}</div>
}

function filterValueOptions(options: any[], inputValue: string): any[]{
  const suggestions = options.filter(row => getSuggestionDescription(row).indexOf(inputValue) > -1);
  return suggestions;
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
            translation={translation}
            getSuggestionValue={getSuggestionValue}
            getSuggestionDescription={getSuggestionDescription}
            getSuggestionRow={getSuggestionRow}
            filterValueOptions={filterValueOptions}
            isOptionParent={isOptionParent}
            filterParentOptions={filterParentOptions}
            {...props}
          />
}

interface IDataIDViewProps {
  label: string,
  id: any,
  important?: boolean,
  chip?: boolean,
  span?: boolean,
  handleDelete?: () => void,
}

export const AccView: React.FunctionComponent<IDataIDViewProps> = observer((props) => {
  const {id, label, important, chip, span, handleDelete} = props;

  const appStore = useContext(AppStoreContext);

  const accKey = `acc/${id}`;
  const acc = appStore.getActData(accKey);

  useEffect(() => {
    if(!acc && id){
      appStore.loadActData(accKey, `/acc/${id}`, {});
    }
  }, [accKey, id, acc, appStore]);

  const value = acc ? acc.name : '...';

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
