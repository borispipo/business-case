import { Loader } from "@googlemaps/js-api-loader";
import { uniqid } from "$shared/utils";

const langRef = {current:null};
const loaderRef = {current:null};
const  mapInstanceRef = {current:null};

export const mapDocumentElementId = uniqid("map-document-element-id");

export const getMapDocumentElement = (elementId : string = mapDocumentElementId)=>{
    if(!window || !window?.document) return null;
    elementId = elementId || mapDocumentElementId;
    var elt = document.querySelector(`${elementId}`);
    if(!elt) {
        elt = document.createElement("div");
        document.body.appendChild(elt);
    }
    elt.id = elementId;
    return elt;
}


/*****
    @see : https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder#maps_places_placeid_finder-javascript
*/
export const getLoader = (force:boolean = false,options ) : Loader=>{
    options = Object.assign({},options);
    const lang = "en";
    if(langRef.current !== lang){
        force = true;
    }
    if(force !== true && loaderRef.current instanceof Loader){
        return loaderRef.current;
    }
    langRef.current = lang;
    loaderRef.current = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        version: "weekly",
        libraries: ["places"],
        ...options,
    });
    return loaderRef.current;
}   

export const load = (force,options)=>{
    const loader = getLoader(force,options);
    return loader.load().then(google=>{
      return google.maps.importLibrary("maps").then((r)=>{
        return {...r,google};
      })
    });
}
const defaultStr= x=> typeof x=="string" && x ||'';
/**** retrieve adddresses from adress_components */
export const getAddressesFromComponents = (address_components) => {
    const address = {
        home: "",
        postal_code: "",
        street: "",
        region: "",
        city: "",
        country: ""
    };
    if(!Array.isArray(address_components)){
        return address;
    }
    address_components.forEach(component => {
      for (var shouldBe in ShouldBeComponent) {
        if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
          const short_name = defaultStr(component.short_name);
          const long_name = defaultStr(component.long_name);
          if (shouldBe === "country") {
            address.country = long_name;
          } else {
            address[shouldBe] = long_name;
          }
          address[shouldBe+"ShortName"] = short_name;
          address[shouldBe+"LongName"] = long_name;
        }
      }
    });
    return address;
} 

const ShouldBeComponent = {
    home: ["street_number"],
    postal_code: ["postal_code"],
    street: ["street_address", "route"],
    region: [
      "administrative_area_level_1",
      "administrative_area_level_2",
      "administrative_area_level_3",
      "administrative_area_level_4",
      "administrative_area_level_5"
    ],
    city: [
      "locality",
      "sublocality",
      "sublocality_level_1",
      "sublocality_level_2",
      "sublocality_level_3",
      "sublocality_level_4"
    ],
    country: ["country"]
  };
  
  export function initMap(force,options) {
    //@ts-ignore
    return new Promise((resolve,reject)=>{
      return load(force,options).then((dat)=>{
        mapInstanceRef.current = dat;
        resolve(dat);
      }).catch((e)=>{
        console.log(e," getting google map instance");
        reject(e);
      })
    })
  }