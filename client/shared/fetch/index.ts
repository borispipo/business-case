import env from "$environment";
import Delivery from "$stypes/Delivery";
import Package from "$stypes/Package";

export const API_HOST = `${env.API_HOST && env.API_HOST.trim().replace(/\\+$/, '') || ""}`

export function unfetch<T>(path, options):Promise<T>{
    return fetch(`${API_HOST}/api/${path.replace(/\\+$/, '')}`,options).then((res=>res.json())) as Promise<T>;
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

export function put <T>(url, options = {}) : Promise<T> {
    return unfetch(url,{...Object.assign({},options),method : 'PUT'});
};

function deleteApi <T>(url, options = {}) : Promise<T>{
    return unfetch(url,{...Object.assign({},options),method : 'DELETE'});
};

export {deleteApi as delete};

/***
    Get all packages
*/
export function getPackages(options) : Promise<Array<Package>> {
    return get<Array<Package>>(`package`,options);
}

/***
    get one package
*/
export function getPackage (packageId,options) : Promise<Package>{
    return get<Package>(`package/${packageId}`,options)
};

/***
    delete a package
*/
export const deletePackage = (packageId,options)=> deleteApi(`package/${packageId}`,options);

/***
    add New package,
*/
export function addPackage(data,options) : Promise<Package>{
    return post<Package>(`package/addNewPackageId`,{
        ...Object.assign({},options),
        body : JSON.stringify(data),
    });
}

/*** update package */
export const updatePackage = (packageId,data,options)=>{
    return put(`package/${packageId}`,{
        ...Object.assign({},options),
        body : JSON.stringify(data),
    });
}


/***
    Get all deliveries
*/
export function getDeliveries(options) : Promise<Array<Delivery>>{
    return get<Array<Delivery>>(`delivery`,options);
}

/***
    get one delivery
*/
export function getDelivery (deliveryId,options) : Promise<Delivery> {
    return get<Delivery>(`delivery/${deliveryId}`,options);
}

/***
    delete a delivery
*/
export const deleteDelivery = (deliveryId,options)=> deleteApi(`delivery/${deliveryId}`,options);

/***
    add New delivery,
*/
export function addDelivery(data,options) : Promise<Delivery>{
    return post<Delivery>(`delivery/addNewDeliveryId`,{
        ...Object.assign({},options),
        body : JSON.stringify(data),
    });
}

/*** update delivery */
export const updateDelivery = (deliveryId,data,options)=>{
    return put(`delivery/${deliveryId}`,{
        ...Object.assign({},options),
        body : JSON.stringify(data),
    });
}


export default {get,put,post,delete:deleteApi,getPackages,getPackage,addPackage,updatePackage,deletePackage};
