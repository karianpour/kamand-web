import { when } from "mobx";
import { PaginatedQueryData } from "../store/appStore";

export async function exportPaginatedDataToCsv(filename: string, paginatedQueryData: PaginatedQueryData, progress?: (proceed: number, total: number, done?: boolean)=>void ) {
  let proceed = 0;
  const total = paginatedQueryData.pageCount * 2 + 2;
  progress && progress(proceed, total);

  const promises: Promise<void>[] = [];
  const promise = async (i: number): Promise<void> => {
    await when(() => {
      paginatedQueryData.getPage(i);
      return !!(paginatedQueryData.getPage(i) && paginatedQueryData.getPage(i)?.data);
    });
    proceed++;
    progress && progress(proceed, total);
  };
  for(let i = 0; i < paginatedQueryData.pageCount; i++){
    promises.push(promise(i));
  }
  try{
    await Promise.all(promises);
    const data: any[] = [];
    for(let i = 0; i < paginatedQueryData.pageCount; i++){
      const d = paginatedQueryData.getPage(i)!.data!;
      data.push(...d);
      proceed++;
      progress && progress(proceed, total);
    }
    const firstRow = data[0];
    const headers = Object.getOwnPropertyNames(firstRow);
    const rows = convertObjectToArray(headers, data);
    proceed++;
    progress && progress(proceed, total);
    exportToCsv(filename, headers, rows);
    proceed++;
    progress && progress(proceed, total, true);
  
  }catch(err){
    console.log(`error while exporting paginated data`, err);
  }
}

export function convertObjectToArray(headers: string[], rows: any[]) {
  return rows.map( row => headers.map( h => row[h]));
}

export function exportToCsv(filename: string, headers: string[], rows: any[][]) {
  var processRow = function (row: any[]) {
      var finalVal = '';
      for (var j = 0; j < row.length; j++) {
          var innerValue = row[j] === null ? '' : row[j].toString();
          if (row[j] instanceof Date) {
              innerValue = row[j].toLocaleString();
          };
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
              result = '"' + result + '"';
          if (j > 0)
              finalVal += ',';
          finalVal += result;
      }
      return finalVal + '\n';
  };

  var csvFile = processRow(headers);
  for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}