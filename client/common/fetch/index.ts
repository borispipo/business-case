import env from "$environment";

export const API_HOST = `${env.API_HOST && env.API_HOST.trim().replace(/\\+$/, '') || ""}`

const unfetch = (path, options)=>{
    return fetch(`${API_HOST}/${path.replace(/\\+$/, '')}`,options).then((res=>res.json));
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
export const post = (url, options = {})=> {
  options = Object.assign({},options);
  return unfetch(url,{...Object.assign({},options),method : 'POST'});
};

export const put = (url, options = {})=> {
    return unfetch(url,{...Object.assign({},options),method : 'PUT'});
};

const deleteApi = (url, options = {})=> {
    return unfetch(url,{...Object.assign({},options),method : 'DELETE'});
};

export {deleteApi as delete};

/***
    Get all packages
*/
export const getPackages = (options)=> get(`package`,options);

/***
    get one package
*/
export const getPackage = (packageId,options)=> get(`package/${packageId}`,options);

/***
    delete a package
*/
export const deletePackage = (packageId,options)=> deleteApi(`package/${packageId}`,options);

/***
    add New package,
*/
export const addPackage = (data,options)=>{
    return post(`package/addNewPackageId`,{
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
export const getDeliveries = (options)=> get(`delivery`,options);

/***
    get one delivery
*/
export const getDelivery = (deliveryId,options)=> get(`delivery/${deliveryId}`,options);

/***
    delete a delivery
*/
export const deleteDelivery = (deliveryId,options)=> deleteApi(`delivery/${deliveryId}`,options);

/***
    add New delivery,
*/
export const addDelivery = (data,options)=>{
    return post(`delivery/addNewDeliveryId`,{
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
