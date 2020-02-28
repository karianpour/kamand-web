export function mapToFarsi(str:string | number | undefined | null) {
  if(!str && str!==0) return str;
  return str.toString().replace(/[1234567890]/gi, e => String.fromCharCode(e.charCodeAt(0) + 1728))
}

export function mapToLatin(str:string | number | undefined | null) {
  if(!str && str!==0) return str;
  return str.toString().replace(/[۱۲۳۴۵۶۷۸۹۰]/gi, e => String.fromCharCode(e.charCodeAt(0) - 1728))
}

export function fatrim(str:string | undefined | null): string {
  if(!str) return "";

  str = str.replace(/[۱۲۳۴۵۶۷۸۹۰]/gi, e => String.fromCharCode(e.charCodeAt(0) - 1728));
  str = str.replace(/[ _\-‌ًٌٍَُِّْٔ ٰٓٔ‍ٕ]/gi, ''); //eerab hame hastand
  str = str.replace(/[آأإء]/gi, 'ا');
  str = str.replace(/[يئى]/gi, 'ی');
  str = str.replace(/[ؤ]/gi, 'و');
  str = str.replace(/[ة]/gi, 'ة');
  str = str.replace(/[ك]/gi, 'ک');

  return str;
}
