//@see : https://github.com/angular/components/blob/main/src/google-maps/README.md
import {Component, Input, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GoogleMapsModule, MapInfoWindow, MapMarker,MapAdvancedMarker} from "@angular/google-maps";
import Location from '$shared/types/Location';
import BaseComponent from '../base';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule,GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent extends BaseComponent{
  
  @ViewChild(MapInfoWindow, { static: false }) infoWindow?: MapInfoWindow;

  @Input() locationFrom?: Location;
  @Input() locationTo?: Location;
  @Input() location ? : Location;

  @Input() !height: string = undefined;
  @Input() !width: string  = undefined;
  readonly markersPositions : Location[] = [];

  @Input() !mapOptions: google.maps.MapOptions = {
    center: {
      lat: this.location?.lat || 0,
      lng: this.location?.lng || 0
    },
    mapId: 'customMap',
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    zoom: 6,
    maxZoom: 15,
    minZoom: 4,
  };
  infoContent: string = '';

  polylineOptions: google.maps.PolylineOptions = {
    path: [],
    strokeColor: '#F78F08',
    strokeOpacity: 1.0,
    strokeWeight: 5,
    draggable: false
  }
  
  ngOnInit(): void {
    this.getCurrentPosition();
  }
  centerOnLocation (location:Location) : void{
    if(location){
      this.mapOptions.center = location;
    }
  }
  getCurrentPosition(callback : (location:Location)=>void = null): void {
    navigator.geolocation.getCurrentPosition((position) => {
      if(typeof position?.coords.latitude == "number" && typeof position?.coords.longitude == "number"){
        const location : Location = {lat: position?.coords.latitude,lng: position?.coords.longitude};
        this.centerOnLocation(location);
        if(callback){
          callback(location);
        }
      }
    });
  }

  ngOnChanges(): void {
    this.locations.map(this.addMarkerPostion.bind(this));
    if (this.hasLocation) {
      this.addPolyline();
    }
  }
  get locations() : Location[]{
    return [this.locationFrom,this.locationTo,this.location];
  }
  get hasLocation(): boolean {
    return this.locations.filter((l)=>!!l).length >=2;
  }

  addMarkerPostion(location: Location): void {
    if(location){
      this.markersPositions.push(location);
    }
  }

  moveMap(event: any): void {
    if (event.latLng != null) {
      this.mapOptions.center = (event.latLng.toJSON());
    }
  }

  moveMapView(): void {
    if(this.locationFrom){
      this.mapOptions.center = {
        lat: this.locationFrom?.lat ?? 0,
        lng: this.locationFrom?.lng ?? 0
      }
    }
  }

  openMapInfo(content: string, marker: MapMarker): void {
    this.infoContent = content;
    this.infoWindow?.open(marker);
  }

  addPolyline(): void {
    const path: google.maps.LatLng[] = [];
    this.markersPositions.forEach((position, index) => {
      path.push(new google.maps.LatLng(position!));
    });
    this.polylineOptions = { ...this.polylineOptions, path };
  }
}