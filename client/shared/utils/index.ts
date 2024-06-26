import moment from "moment/";

/***
  les dates sont convertis au formats universel avant d'être envoyées côté serveur
*/
export const toMySQLDate = function(date : string | Date) : Date {
    if(!date) return undefined;
    return moment.utc(date)?.local().toDate();//?.format('YYYY-DD-MM HH:mm:ss')
};
  
export const toLocaleDateString = (date : string | Date) : string =>{
  if(!date) return undefined;
  date = new Date(date).toISOString();
  return date.substring(0, date.length - 1)
}

/****
  convertis l'objet date au format par défaut, en sachant que la date est sauvegardée au format UTC en base de données
*/
export const dateToDefaultFormat = (date : string | Date) : string =>{
  if(!date) return "";
  return moment.utc(new Date(date)).format("DD/MM/YYYY  HH:mm:ss")
}

// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/***
* generate uid : uid(16) generate uid with 16 max  characters
* uid("prefix",16) generate uid with max 16 chars and having prefix like prefix
* 
* @param {string} prefix
* @param {type} idStrLen
* @param {type} separator
* @returns {String|Number|uid.idStr}
*/
export function uniqid (prefix : number | string,idStrLen:number = 16,separator:string = "") : string {
  separator = typeof separator =="string" && separator ? separator : "";
  prefix =  typeof prefix =="string" && prefix ? prefix : "";
  if(typeof idStrLen !=='number') idStrLen = idStrLen-prefix.length;
  if(idStrLen <= 0) idStrLen = 16;
  idStrLen = Math.floor(idStrLen);
  // always start with a letter -- base 36 makes for a nice shortcut
  var idStr = prefix+(Math.floor((Math.random() * 25)) + 10).toString(36) + separator;
  // add a timestamp in milliseconds (base 36 again) as the base
  idStr += (new Date()).getTime().toString(36) + separator;
  // similar to above, complete the Id using random, alphanumeric characters
  do {
      idStr += (Math.floor((Math.random() * 35))).toString(36);
  } while (idStr.length < idStrLen);
  return (idStr);
}