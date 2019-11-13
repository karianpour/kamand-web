import React, { useEffect, useContext} from 'react';
import { KamandSuggestInput } from '../../lib/components/KamandSuggest';
import { IQueryData } from '../../lib/store/interfaces/dataInterfaces';
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

function getMatchingSuggestions(value: any, suggestionData: IQueryData){
  if(!suggestionData || !suggestionData.data) return [];
  const suggestions = suggestionData.data.filter(row => getSuggestionDescription(row).indexOf(value) > -1).map(row => row);
  return suggestions;
}

export const AccSuggestInput = (props: any)=>{
  return <KamandSuggestInput
            queryKey={'acc_suggest'}
            query={'acc_list'}
            publicQuery={false}
            queryParam={{}}
            getSuggestionValue={getSuggestionValue}
            getSuggestionDescription={getSuggestionDescription}
            getMatchingSuggestions={getMatchingSuggestions}
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
