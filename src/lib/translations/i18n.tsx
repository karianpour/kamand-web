import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
// import fa from './fa';
// import en from './en';
import { mapToFarsi } from '../utils/farsiUtils';

export function initTranslation(resources: any){
  i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'fa',
    debug: false,
    interpolation: {
      // React already does escaping
      escapeValue: false,
      format: function(value, format, lng) {
        if (format === 'number' && lng==='fa') return mapToFarsi(value);
        if (format === 'translate') return i18next.t(value);
        // if(value instanceof Date) return moment(value).format(format);
        return value;
      }
    },
    lng: 'fa', // 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources,
    //  {
    //   fa,
    //   en,
    // },
  })
}


export default i18next;