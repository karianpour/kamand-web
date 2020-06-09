export function mapToFarsi(str: string | number | undefined | null): string | number | undefined | null {
  if (!str && str !== 0) return str;
  return str.toString().replace(/[1234567890١٢٣٤٥٦٧٨٩٠]/gi, e => { const c = e.charCodeAt(0); return String.fromCharCode(c + (c < 60 ? 1728 : 144)) })
}

export function mapToLatin(str: string | number | undefined | null): string | number | undefined | null {
  if (!str && str !== 0) return str;
  return str.toString().replace(/[۱۲۳۴۵۶۷۸۹۰١٢٣٤٥٦٧٨٩٠]/gi, e => { const c = e.charCodeAt(0); return String.fromCharCode(c - (c < 1770 ? 1584 : 1728)) })
}

export function stripAnyThingButDigits(str: string): string {
  if(!str) return str;
  return str.toString().replace(/[^1234567890۱۲۳۴۵۶۷۸۹۰١٢٣٤٥٦٧٨٩٠]/gi, '');
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
