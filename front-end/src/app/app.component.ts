import { Component } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { latLng, Map, marker, tileLayer, Layer, LatLngBounds, divIcon, LayerGroup } from 'leaflet';
import { CustomMarker } from './models/customMarker';
import { PopupComponent } from './popup/popup.component';
import { MarkerService } from './services/MarkerService';
import { AccountService } from './services/accountService';
import { Account } from './models/account';
import { Color } from './models/Color';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Business Map';
  markers: Layer[] = [];
  map: Map;
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

  options = {
    layers: [ this.gtaMap ],
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
            icon: divIcon({
              iconSize: [ 25, 41 ],
              iconAnchor: [ 19, 41 ],
              popupAnchor: [2, -36],
              html: `<i class="material-icons markerIcon" style="font-size:40px;height:40px;color:${customMarker.color.colorCode};">place</i>`,
              className: ''
            })
          })
    
          this.map.addLayer(newMarker.bindPopup( fl => {
            const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
            popupEl.addEventListener("colorChanged", ($event) => { this.colorChangedEventHandler($event); })
            popupEl.map = this.map;
            popupEl.mapMarker = newMarker;
            popupEl.markerId = customMarker.id;
            popupEl.name = customMarker.name;
            popupEl.notes = customMarker.notes;
            popupEl.latitude = customMarker.latitude;
            popupEl.longitude = customMarker.longitude;
            popupEl.state = customMarker.color.colorCode;
            popupEl.color = customMarker.color;
            return popupEl;
          }))
      })
    }, (error) => {
      console.log(error);
    });
  }

  addMapMarkerHandler(){
        // Add listener to the map to make new markers
        this.map.addEventListener("click", (event: any) => {  
          if (event.originalEvent.ctrlKey) {
            let customMarker: CustomMarker = new CustomMarker();
            let newMarker: Layer;
            if (event.originalEvent.ctrlKey) {
            customMarker.latitude = event.latlng.lat;
            customMarker.longitude = event.latlng.lng;

            const color: Color = new Color();
            color.id = 1
            color.colorCode = "#555555";
            customMarker.color = color;

            this.markerService.makeMarker(customMarker).subscribe((r)=> { customMarker = r; });
            newMarker = marker([event.latlng.lat, event.latlng.lng], {
              icon: divIcon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 19, 41 ],
                popupAnchor: [2, -36],
                html: `<i class="material-icons markerIcon" style="font-size:40px;height:40px;color:${customMarker.color.colorCode};">place</i>`,
                className: ''
              })
            });
            this.map.addLayer(newMarker.bindPopup( fl => {
              const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
              popupEl.addEventListener("colorChanged", ($event) => { this.colorChangedEventHandler($event); })
              popupEl.map = this.map;
              popupEl.mapMarker = newMarker;
              popupEl.markerId = customMarker.id;
              popupEl.name = customMarker.name;
              popupEl.notes = customMarker.notes;
              popupEl.latitude = customMarker.latitude;
              popupEl.longitude = customMarker.longitude;
              popupEl.state = customMarker.color.colorCode;
              popupEl.color = color;
              return popupEl;
            }))
          }
        }   
        })
  }
  
  colorChangedEventHandler(event: any){
    const customMarker: CustomMarker = event.detail[0];
    const oldMarker: Layer = event.detail[1];
    this.map.removeLayer(oldMarker);

    const newMarker = marker([customMarker.latitude, customMarker.longitude], {
      icon: divIcon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 19, 41 ],
        popupAnchor: [2, -36],
        html: `<i class="material-icons markerIcon" style="font-size:40px;height:40px;color:${customMarker.color.colorCode};">place</i>`,
        className: ''
      })
    });

    this.map.addLayer(newMarker.bindPopup( fl => {
      const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
      popupEl.addEventListener("colorChanged", ($event) => { this.colorChangedEventHandler($event); })
      popupEl.map = this.map;
      popupEl.mapMarker = newMarker;
      popupEl.markerId = customMarker.id;
      popupEl.name = customMarker.name;
      popupEl.notes = customMarker.notes;
      popupEl.latitude = customMarker.latitude;
      popupEl.longitude = customMarker.longitude;
      popupEl.state = customMarker.color.colorCode;
      popupEl.color = customMarker.color;
      return popupEl;
    }))
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
