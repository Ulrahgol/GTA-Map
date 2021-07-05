import { Component } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { icon, latLng, Map, marker, tileLayer, Layer, Marker, LatLng } from 'leaflet';
import { Subscription } from 'rxjs';
import { CustomMarker } from './models/customMarker';
import { PopupComponent } from './popup/popup.component';
import { MarkerService } from './services/MarkerService';
import { AccountService } from './services/accountService';
import {Md5} from 'ts-md5/dist/md5';
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
      maxZoom: 5, 
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
    center: latLng([ 60, -100 ])
  };

  subscriptions: Subscription[];

  constructor(private markerService: MarkerService, private accountService: AccountService) {
      this.subscriptions = [];
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
              });
        
              this.map.addLayer(newMarker.on('click', (event: any) => {
                if (event.originalEvent.ctrlKey) {
                  this.removeLayer(newMarker);
                }
              }).bindPopup( fl => {
                const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
                // Listen to the close event
                popupEl.marker = newMarker;
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
        this.map.addEventListener("click", (e: any) => {     
          let customMarker: CustomMarker = new CustomMarker();
          customMarker.latitude = e.latlng.lat;
          customMarker.longitude = e.latlng.lng;
          this.markerService.makeMarker(customMarker).subscribe((r)=> { customMarker = r; });
          const newMarker = marker([e.latlng.lat, e.latlng.lng], {
            icon: icon({       
              iconSize: [ 25, 41 ],
              iconAnchor: [ 13, 41 ],
              popupAnchor: [2, -40],
              iconUrl: 'leaflet/marker-icon.png',
              shadowUrl: 'leaflet/marker-shadow.png'
            })
          });
    
          this.map.addLayer(newMarker.on('click', (event: any) => {
            if (event.originalEvent.ctrlKey) {
              this.removeLayer(newMarker);
            }
          }).bindPopup( fl => {
            const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
            // Listen to the close event
            popupEl.marker = newMarker;
            popupEl.markerId = customMarker.id;
            popupEl.name = customMarker.name;
            popupEl.notes = customMarker.notes;
            popupEl.latitude = customMarker.latitude;
            popupEl.longitude = customMarker.longitude;
            // Add to the DOM
            return popupEl;
          }))
    
        })
  }

  removeLayer(marker: Marker){
    const latlng: LatLng = marker.getLatLng();
    this.map.removeLayer(marker)
    this.markerService.deleteMarker(latlng.lat, latlng.lng).subscribe(()=> { });
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
