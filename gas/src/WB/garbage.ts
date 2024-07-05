// //////////////////////////
// /// MEMORY ADDRESSING ///
// ////////////////////////
//
// const getSheet = (sheet) => {
//   return SpreadsheetApp
//     .getActiveSpreadsheet()
//     .getSheetByName(sheet);
// };
//
// const getRange = (addr) => {
//   const [
//     sheet,
//     range,
//   ] = addr.split('!');
//
//   return getSheet(sheet).getRange(range);
// };
//
// const readCell = addr => getRange(addr).getValue();
//
// const writeCell = (addr, content) => getRange(addr).setValue(content);
//
// const writeToSheet = (sheetName, content) => {
//   const sheet = getSheet(sheetName);
//   const maxLength = Math.max(...content.map(x => x.length));
//
//   // add empty cells at end of short rows
//   content = content.map(row => [
//     ...row,
//     ...Array(Math.max(
//       0,
//       maxLength - row.length,
//     )).fill(''),
//   ]);
//
//   const destRange = sheet.getRange(
//     1,
//     1,
//     content.length,
//     content[0].length,
//   );
//
//   return destRange.setValues(content);
// };
//
// const clearSheet = (sheetName) => {
//   getSheet(sheetName).clear();
// };
//
// const writeCells = (addr, cells) => getRange(addr).setValues(cells);
//
// const wbAPI = (method, url, payloadOrQuery) => {
//   const token = readCell('API!A1');
//
//   return httpRequest(
//     url,
//     {
//       Authorization: `Bearer ${token}`,
//     },
//     method,
//     payloadOrQuery,
//   );
// };
//
// function getAdvertIDs() {
//   const { json } = wbAPI(
//     'GET',
//     'https://advert-api.wildberries.ru/adv/v1/promotion/count',
//   );
//   const { adverts } = json;
//
//   const allIds = adverts.flatMap(av => av.advert_list.map(av => av.advertId));
//
//   return [...new Set(allIds)];
// }
//
// function batchSplit(coll = [], maxLength = 10) {
//   const batches = [];
//
//   const numBatches = Math.ceil(coll.length / maxLength);
//   for (let i = 0; i < numBatches; i++) {
//     const batch = coll.slice(
//       0,
//       maxLength,
//     );
//
//     batches.push(batch);
//
//     coll = coll.slice(batch.length);
//   }
//
//   return batches;
// }
//
// const getDate = (d = new Date()) => d.toISOString().split('T')[0];
//
// function getInfoAboutAdverts() {
//   const ids = getAdvertIDs();
//   const idBatches = batchSplit(
//     ids,
//     50,
//   );
//
//   const dates = [
//     getDate(),
//     getDate(new Date(Date.now() - 24 * 60 * 60 * 1000 * 5)),
//   ];
//   const idsWithDate = idBatches[0].map(id => ({ id,
//     dates }));
//
//   const { json } = wbAPI(
//     'POST',
//     'https://advert-api.wildberries.ru/adv/v2/fullstats',
//     idsWithDate,
//   );
//
//   writeToSheet(
//     'Реклама',
//     json,
//   );
// }
