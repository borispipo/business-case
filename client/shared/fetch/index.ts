import env from "$environment";
import Delivery from "$stypes/Delivery";
import Package from "$stypes/Package";

export function getLocalHost() : string{
    const port = window.location.port;
    return window.location.protocol + '//' + window.location.hostname+(port?(":"+port):"");
}

export const API_HOST : string = (env.API_HOST && env.API_HOST.trim() || getLocalHost()).replace(/\\+$/, '');

export function unfetch<T>(path, options):Promise<T>{
    options = Object.assign({},options);
    return fetch(`${API_HOST}/api/${path.replace(/\\+$/, '')}`,{...options,...{
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...Object.assign({},options.headers)
        },
    }}).then((res=>{
        return res.json().then((response)=>{
            if([200,201].includes(res.status)){
                return response;
            }
            const message = response?.message || response && response?.toString() || null;
            if(message){
                alert(`API Error : ${path},\n ${message}`);
            }
            throw response;
        })
    })) as Promise<T>;
}

/***@function
 * @namespace api/unfetch
 *  function permettant d'exécuter la requête ajax de type GET 
 * les paramètres sont identiques à ceux de la function {@link unfetch} à la seule différence que 
 * la méthode utilisée (props method des options) est GET
 */
export const get = unfetch;
/***@function 
 * function permettant d'exécuter la requête ajax POST, les paramètres sont identiques à ceux de la function {@link unfetch} à la seule différence que 
 * la méthode utilisée (props method des options) est POST
 */
export function post<T>(url, options = {}) : Promise<T> {
  options = Object.assign({},options);
  return unfetch(url,{...Object.assign({},options),method : 'POST'});
};

/****
    Crée une nouvelle données en base de donées
*/
export function put <T>(url, options = {}) : Promise<T> {
    return unfetch(url,{...Object.assign({},options),method : 'PUT'});
};

/***
    Supprime une données en bd
*/
function apiDelete <T>(url, options = {}) : Promise<T>{
    return unfetch(url,{...Object.assign({},options),method : 'DELETE'});
};

/***
    Get all packages
*/
export function getPackages(options = {}) : Promise<Array<Package>> {
    return get<Array<Package>>(`package`,options);
}

/***
    get one package
*/
export function getPackage (packageId,options = {}) : Promise<Package>{
    return get<Package>(`package/${packageId}`,options)
};

/***
    delete a package
*/
export const deletePackage = (packageId,options = {})=> apiDelete(`package/${packageId}`,options);

/***
    add New package,
*/
export function addPackage(data,options = {}) : Promise<Package>{
    return post<Package>(`package/addNewPackageId`,{
        ...Object.assign({},options),
        body : JSON.stringify(data),
    });
}

/*** update package */
export const updatePackage = (packageId,data,options = {})=>{
    return put(`package/${packageId}`,{
        ...Object.assign({},options),
        body : JSON.stringify(data),
    });
}


/***
    Get all deliveries
*/
export function getDeliveries(options = {}) : Promise<Array<Delivery>>{
    return get<Array<Delivery>>(`delivery`,options);
}

/***
    get one delivery
*/
export function getDelivery (deliveryId,options = {}) : Promise<Delivery> {
    return get<Delivery>(`delivery/${deliveryId}`,options);
}

/***
    delete a delivery
*/
export const deleteDelivery = (deliveryId,options = {})=> apiDelete(`delivery/${deliveryId}`,options);

/***
    add New delivery,
*/
export function addDelivery(data,options = {}) : Promise<Delivery>{
    return post<Delivery>(`delivery/addNewDeliveryId`,{
        ...Object.assign({},options),
        body : JSON.stringify(data),
    });
}

/*** update delivery */
export const updateDelivery = (deliveryId,data,options = {})=>{
    return put(`delivery/${deliveryId}`,{
        ...Object.assign({},options),
        body : JSON.stringify(data),
    });
}


export default {get,put,post,delete:apiDelete,getPackages,getPackage,addPackage,updatePackage,deletePackage};
