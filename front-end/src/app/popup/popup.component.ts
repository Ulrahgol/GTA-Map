import { Component, OnInit, Input } from "@angular/core";
import { NgElement, WithProperties } from "@angular/elements";
import { icon, marker, Marker } from "leaflet";
import { CustomMarker } from "../models/customMarker";
import { MarkerService } from "../services/MarkerService";
declare var $: any;

@Component({
    selector: 'popup',
    template: `
    <form class="example-form">
        <mat-form-field appearance="fill">
        <mat-label>Name</mat-label>
        <input matInput id="name" value="{{name}}">
        </mat-form-field>
    
        <mat-form-field appearance="fill">
        <mat-label>Notes</mat-label>
        <textarea matInput id="notes">{{notes}}</textarea>
        </mat-form-field>
        <mat-form-field appearance="fill">
            <button mat-flat-button color="primary" (click)="updateMarker()">Save</button>
        </mat-form-field>
    </form>
  `,
    styleUrls: ['./popup.component.scss']
  })
  export class PopupComponent implements OnInit {
  
    @Input() marker: Marker = marker([ 0, 0 ], {
        icon: icon({
          iconSize: [ 0, 0 ],
          iconAnchor: [ 0, 0 ],
          iconUrl: 'leaflet/marker-icon.png'
        })});
    @Input() markerId: number = 0;
    @Input() name: string = "";
    @Input() notes: string = "";
    @Input() latitude: number = 0;
    @Input() longitude: number = 0;

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
        this.markerService.updateMarker(customMarker).subscribe(marker => {
            this.marker.bindPopup( fl => {
                const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
                // Listen to the close event
                popupEl.marker = this.marker;
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
  
  }