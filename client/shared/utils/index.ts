import moment from "moment";

/***
  les dates sont convertis au formats universel avant d'être envoyées côté serveur
*/
export const toMySQLDate = function(date : string | Date) : string {
    if(!date) return undefined;
    return moment.utc(date)?.local()?.format('YYYY-DD-MM HH:mm:ss');
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