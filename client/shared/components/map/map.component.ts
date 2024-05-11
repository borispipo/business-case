import {Component, Input, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GoogleMapsModule, MapInfoWindow, MapMarker} from "@angular/google-maps";
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

  @Input() !height: string | number = '600px';
  @Input() !width: string | number = '600px';

  @Input() !mapOptions: google.maps.MapOptions = {
    center: {
      lat: this.locationFrom?.lat || 0,
      lng: this.locationFrom?.lng || 0
    },
    mapId: 'customMap',
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    zoom: 6,
    maxZoom: 15,
    minZoom: 4,
  };

  markers: Set<google.maps.Marker> = new Set();

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

  getCurrentPosition(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.mapOptions.center = {
        lat: position?.coords.latitude ?? 46.788,
        lng: position?.coords.longitude ?? -71.3893,
      }
    });
  }

  ngOnChanges(): void {
    if (this.locationFrom) {
      this.addMarker(this.locationFrom);
    }

    if (this.locationTo) {
      this.addMarker(this.locationTo);
    }

    if (this.hasLocation) {
      this.addPolyline();
    }
  }

  get hasLocation(): boolean {
    return !!this.locationFrom && !!this.locationTo;
  }

  loadMarker(location?: Location): google.maps.Marker {
    return new google.maps.Marker({
      position: {
        lat: location?.lat ?? 0,
        lng: location?.lng ?? 0
      },
      title: location?.name ?? '',
      animation: google.maps.Animation.DROP,
      draggable: false,
    });
  }

  addMarker(location: Location): void {
    const marker = this.loadMarker(location);
    this.markers.add(marker);
    this.moveMapView();
  }

  moveMap(event: any): void {
    if (event.latLng != null) {
      this.mapOptions.center = (event.latLng.toJSON());
    }
  }

  moveMapView(): void {
    this.mapOptions.center = {
      lat: this.locationFrom?.lat ?? 0,
      lng: this.locationFrom?.lng ?? 0
    }
  }

  openMapInfo(content: string, marker: MapMarker): void {
    this.infoContent = content;
    this.infoWindow?.open(marker);
  }

  addPolyline(): void {
    const markers = Array.from(this.markers).slice(-2);
    const path: google.maps.LatLng[] = [];
    markers.forEach((marker, index) => {
      path.push(new google.maps.LatLng(marker.getPosition()!));
    });
    this.polylineOptions = { ...this.polylineOptions, path };
    this.markers = new Set(markers);
  }
}