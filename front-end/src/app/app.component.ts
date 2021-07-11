import { Component } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { latLng, Map, tileLayer, Layer, LatLngBounds, divIcon, LayerGroup } from 'leaflet';
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
  markers: LayerGroup = new LayerGroup();
  layerGroups: LayerGroup[] = [this.markers];
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
        this.addMarker(customMarker);
      })
    }, (error) => {
      console.log(error);
    });
  }

  addMapMarkerHandler(){
    // Add listener to the map to make new markers
    this.map.addEventListener("click", (event: any) => {
        if (event.originalEvent.ctrlKey) {
          let customMarker: CustomMarker = new CustomMarker([event.latlng.lat,event.latlng.lng]);
          const color: Color = new Color();
          color.id = 1
          color.colorCode = "#555555";
          customMarker.color = color;

          this.markerService.makeMarker(customMarker).subscribe((res)=> { 
            this.addMarker(res);
          });
        }
    })
  }

  markerUpdatedEventHandler(event: any){
    console.log(event.detail);
    this.markerService.updateMarker(event.detail).subscribe((marker: CustomMarker) => {
      console.log(marker);
      const layerId = this.markers.getLayerId(event.detail);
      const layer = this.markers.getLayer(layerId);
      if(layer){
        this.markers.removeLayer(layer);
        this.addMarker(marker);
      }
    });
  }

  markerDeletedEventHandler(event: any){
    const layerId = this.markers.getLayerId(event.detail);
    const layer = this.markers.getLayer(layerId);
    if(layer){
      this.markerService.deleteMarker(event.detail.id).subscribe(() => {
        this.markers.removeLayer(layer);
      }); 
    }
  }

  colorDeletedEventHandler(event: any){
    const deletedColor: Color = event.detail[0];
    const standardColor: Color = event.detail[1];

    this.markers.getLayers().forEach((layer: Layer) => {
      let marker: CustomMarker = (layer as CustomMarker);
        if(marker.color.colorCode == deletedColor.colorCode ){
            this.map.removeLayer(layer);
            marker.color = standardColor;
            marker.colorId = standardColor.id;
            this.addMarker(marker);
        }
    });
  }

  addMarker(customMarker: CustomMarker){
    let completeCustomMarker: CustomMarker = new CustomMarker([customMarker.latitude, customMarker.longitude], {
      icon: divIcon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 19, 41 ],
        popupAnchor: [2, -36],
        html: `<i class="material-icons markerIcon" style="font-size:40px;height:40px;color:${customMarker.color.colorCode};">place</i>`,
        className: ''
      })
    },customMarker.id, customMarker.name, customMarker.notes, customMarker.colorId, customMarker.color);

    this.markers.addLayer(completeCustomMarker.bindPopup( fl => {
      const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
      popupEl.addEventListener("markerUpdated", ($event) => { this.markerUpdatedEventHandler($event); })
      popupEl.addEventListener("markerDeleted", ($event) => { this.markerDeletedEventHandler($event); })
      popupEl.addEventListener("colorDeleted", ($event) => { this.colorDeletedEventHandler($event); })
      popupEl.mapMarker = completeCustomMarker;
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
