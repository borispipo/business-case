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