import { MatDialog } from '@angular/material/dialog';
//@see : https://github.com/angular/components/blob/main/src/google-maps/README.md
import {Component, Input, ViewChild} from '@angular/core';
import { Observable,map } from 'rxjs';
import { CommonModule } from '@angular/common';
import {GoogleMapsModule, MapInfoWindow, MapMarker,MapDirectionsRenderer, MapDirectionsService} from "@angular/google-maps";
import Location from '$shared/types/Location';
import BaseComponent from '../base';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule,GoogleMapsModule,MapDirectionsRenderer],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent extends BaseComponent{
  
  @ViewChild(MapInfoWindow, { static: false }) infoWindow?: MapInfoWindow;
  @Input() locationFrom?: Location;
  @Input() locationTo?: Location;
  @Input() location ? : Location;
  directionsResults$: Observable<google.maps.DirectionsResult|undefined> = null;
  mapDirectionsService : MapDirectionsService;
  readonly mapId : string = this.uniqid("gmap-id");

  @Input() !height: string = undefined;
  @Input() !width: string  = undefined;
  markersPositions : Location[] = [];
  constructor(dialog:MatDialog,confirmDialog : MatDialog,mapDirectionsService: MapDirectionsService) {
    super(dialog,confirmDialog);
    this.mapDirectionsService = mapDirectionsService;
  }
  @Input() !mapOptions: google.maps.MapOptions = {
    center: {
      lat: this.location?.lat || 0,
      lng: this.location?.lng || 0
    },
    mapId: this.mapId,
    //scrollwheel: false,
    //disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    scaleControl: true,
    zoom: 6,
    //maxZoom: 15,
    //minZoom: 4,
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
  prefixLocationTitle(location:Location,title:string) : void{
    if(location && title){
      location.title = location.title || '';
      if(!location.title.toLowerCase().startsWith(title.toLowerCase().trim()+" :")){
        location.title = `${title} : ${location.title}`;
      }
    }
  }
  prepareDirections(){
    if(this.locationFrom && this.locationTo){
      const request: google.maps.DirectionsRequest = {
        destination: this.locationTo,
        origin: this.locationFrom,
        travelMode: google.maps.TravelMode.DRIVING
      };
      if(this.location){
        request.waypoints = [{location:this.location}]
      }
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
    }
  }
  ngOnChanges(): void {
    this.markersPositions = [];
    this.prepareDirections();
    this.prefixLocationTitle(this.locationFrom,"From");
    this.prefixLocationTitle(this.locationTo,"To");
    this.prefixLocationTitle(this.location,"Current location");
    this.locations.map(this.addMarkerPostion.bind(this));
    if (this.hasLocation) {
      this.addPolyline();
    }
  }
  get locationsObjects(){
    return {location:this.location,locationFrom:this.locationFrom,locationTo:this.locationTo};
  }
  get locations() : Location[]{
    return ["locationFrom","location","locationTo"].map((key)=>{
      return this.locationsObjects[key];
    });
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
    return;
    const path: google.maps.LatLng[] = [];
    this.markersPositions.forEach((position, index) => {
        path.push(new google.maps.LatLng(position!));
    });
    this.polylineOptions = { ...this.polylineOptions, path };
  }
}