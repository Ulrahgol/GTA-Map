import { Component } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { icon, latLng, Map, marker, tileLayer, Layer, LatLngBounds } from 'leaflet';
import { CustomMarker } from './models/customMarker';
import { PopupComponent } from './popup/popup.component';
import { MarkerService } from './services/MarkerService';
import { AccountService } from './services/accountService';
import { Account } from './models/account';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Business Map';
  markers: Layer[] = [];
  map: any = {};
  loggedIn: boolean = false;
  error: string

  gtaMap = tileLayer(
    '../assets/map/{z}/{x}/{y}.png',
    { 
      maxZoom: 7, 
      minZoom: 3,
      attribution: "..." 
    }
);

marker = marker([ 0, 0 ], {
  icon: icon({
    iconSize: [ 0, 0 ],
    iconAnchor: [ 0, 0 ],
    iconUrl: 'leaflet/marker-icon.png'
  })
});

  options = {
    layers: [ this.gtaMap, this.marker ],
    zoom: 3,
    center: latLng([ 65, -100 ]),
    maxBounds: new LatLngBounds([
      [-50, 50],
      [216, -280]] )
  };

  constructor(private markerService: MarkerService, private accountService: AccountService) {

  }

  onMapReady(map: Map) {
    this.map = map;
    this.GetMarkers();
    this.addMapMarkerHandler();
  }

  GetMarkers(){
        // Get and display all markers
        this.markerService.getMarkers().subscribe((markers: CustomMarker[]) => {
          markers.forEach((customMarker: CustomMarker) => {
              const newMarker = marker([customMarker.latitude, customMarker.longitude], {
                icon: icon({
                  iconSize: [ 25, 41 ],
                  iconAnchor: [ 13, 41 ],
                  popupAnchor: [2, -40],
                  iconUrl: 'leaflet/marker-icon.png',
                  shadowUrl: 'leaflet/marker-shadow.png'
                })
              })
        
              this.map.addLayer(newMarker.bindPopup( fl => {
                const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
                // Listen to the close event
                popupEl.map = this.map;
                popupEl.mapMarker = newMarker;
                popupEl.markerId = customMarker.id;
                popupEl.name = customMarker.name;
                popupEl.notes = customMarker.notes;
                popupEl.latitude = customMarker.latitude;
                popupEl.longitude = customMarker.longitude;
                // Add to the DOM
                return popupEl;
              }))
          })
        }, (error) => {
          console.log(error);
        });
  }

  addMapMarkerHandler(){
        // Add listener to make new markers
        this.map.addEventListener("click", (event: any) => {  
          if (event.originalEvent.ctrlKey) {
            let customMarker: CustomMarker = new CustomMarker();
            let newMarker: Layer;
            if (event.originalEvent.ctrlKey) {
            customMarker.latitude = event.latlng.lat;
            customMarker.longitude = event.latlng.lng;
            this.markerService.makeMarker(customMarker).subscribe((r)=> { customMarker = r; });
            newMarker = marker([event.latlng.lat, event.latlng.lng], {
              icon: icon({       
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                popupAnchor: [2, -40],
                iconUrl: 'leaflet/marker-icon.png',
                shadowUrl: 'leaflet/marker-shadow.png'
              })
            });
            this.map.addLayer(newMarker.bindPopup( fl => {
              const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
              // Listen to the close event
              popupEl.map = this.map;
              popupEl.mapMarker = newMarker;
              popupEl.markerId = customMarker.id;
              popupEl.name = customMarker.name;
              popupEl.notes = customMarker.notes;
              popupEl.latitude = customMarker.latitude;
              popupEl.longitude = customMarker.longitude;
              // Add to the DOM
              return popupEl;
            }))
          }
        }   
        })
  }

  login(obj: any){
    this.accountService.login(new Account(obj.username, obj.password)).subscribe((account) => {
      this.loggedIn = true;
    }, (error) =>{
      this.error = "Wrong username or password.";      
      this.loggedIn = false;
    });
  }
}
