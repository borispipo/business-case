import { Component } from '@angular/core';
import {GoogleMap} from '@angular/google-maps';
import { Input } from '@angular/core';
import { MapComponent } from '../map.component';
import {Location,PlaceChangeResult} from "$stypes";
import {getAddressesFromComponents} from "../utils";


@Component({
  selector : "map-location",
  standalone: true,
  imports: [GoogleMap],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class MapLocationComponent extends MapComponent{
  @Input() inputSelector : string; //le selecteur input où sera exécutée la fonction auto complate
  @Input() ! autoCompleteOptions : google.maps.places.AutocompleteOptions;
  @Input() onPlaceChange? : (place2Addresses:PlaceChangeResult)=>void; //callback when location change
  locationChangeResult : PlaceChangeResult = {place:null,addersses : {}};
  readonly mapElementId : string = this.uniqid("location-map-element-id");
  mapListener : google.maps.MapsEventListener;
  ngOnInit(): void {
    super.ngOnInit();
  }
  async initAutoComplete() : Promise<google.maps.places.Autocomplete>{
    const mapElement : HTMLElement = document.querySelector(`#${this.mapElementId}`);
    if(!mapElement) return null;
    const map  = new google.maps.Map(mapElement, this.mapOptions);
    if(map){
      return new Promise((resolve,reject)=>{
        this.getCurrentPosition((location:Location)=>{
          const input : HTMLInputElement = document.querySelector(this.inputSelector);
          if(input){
            const autocomplete = new google.maps.places.Autocomplete(input, {
              fields : ["place_id","address_components", "geometry", "formatted_address", "name"],
              strictBounds : false,
              ...Object.assign({},this.autoCompleteOptions)
           });
           if(this.mapListener && this.mapListener.remove){
            try {
                this.mapListener.remove();
            } catch{}
          }
          this.mapListener = autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              if (!place.geometry || !place.geometry.location) {
                return;
              }
              const location : Location = {lng:place.geometry.location.lng(), lat:place.geometry.location.lat()};
              this.locationChangeResult = {place,addersses:getAddressesFromComponents(place?.address_components),location};
              if(this.onPlaceChange){
                this.onPlaceChange(this.locationChangeResult);
              }
          });
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
           return resolve(autocomplete);
          }
        })
      });
    }
    return Promise.reject(null);
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.initAutoComplete();
  }
}
