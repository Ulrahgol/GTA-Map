import { Component, OnInit, Input } from "@angular/core";
import { NgElement, WithProperties } from "@angular/elements";
import { Layer, Map } from "leaflet";
import { CustomMarker } from "../models/customMarker";
import { MarkerService } from "../services/MarkerService";
declare var $: any;

@Component({
    selector: 'popup',
    templateUrl: 'popup.component.html',
    styleUrls: ['./popup.component.scss']
  })
  export class PopupComponent implements OnInit {
  
    @Input() markerId: number = 0;
    @Input() name: string = "";
    @Input() notes: string = "";
    @Input() latitude: number = 0;
    @Input() longitude: number = 0;
    @Input() mapMarker: Layer;
    @Input() map: Map;

    deleting: Boolean = false;

    constructor(private markerService: MarkerService) {
    }
  
    ngOnInit() {
    }

    updateMarker(){
        let name = $('#name').val();
        let notes = $('#notes').val();        

        let customMarker = new CustomMarker();
        customMarker.id = this.markerId;
        customMarker.name = name;
        customMarker.notes = notes;
        customMarker.latitude = this.latitude;
        customMarker.longitude = this.longitude;
        this.markerService.updateMarker(customMarker).subscribe(() => {
            this.mapMarker.bindPopup( fl => {
                const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
                // Listen to the close event
                popupEl.map = this.map;
                popupEl.mapMarker = this.mapMarker;
                popupEl.markerId = customMarker.id;
                popupEl.name = customMarker.name;
                popupEl.notes = customMarker.notes;
                popupEl.latitude = customMarker.latitude;
                popupEl.longitude = customMarker.longitude;
                // Add to the DOM
                return popupEl;
              })
        });
      }

      toggleDeletePrompt(){
        this.deleting = !this.deleting;
      }

      deleteMarker(){
        this.markerService.deleteMarker(this.markerId).subscribe(() => {
          this.map.removeLayer(this.mapMarker);
        });   
      }
  
  }