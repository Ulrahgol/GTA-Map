import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from "@angular/core";
import { NgElement, WithProperties } from "@angular/elements";
import { Layer, Map } from "leaflet";
import { ColorEvent } from "ngx-color";
import { Color } from "../models/Color";
import { CustomMarker } from "../models/customMarker";
import { ColorService } from "../services/ColorService";
import { MarkerService } from "../services/MarkerService";
declare var $: any;

@Component({
    selector: 'popup',
    templateUrl: 'popup.component.html',
    styleUrls: ['./popup.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class PopupComponent implements OnInit {
  
    @Input() markerId: number = 0;
    @Input() name: string = "";
    @Input() notes: string = "";
    @Input() latitude: number = 0;
    @Input() longitude: number = 0;
    @Input() mapMarker: Layer;
    @Input() map: Map;
    @Input() state: string;
    @Input() color: Color;

    @Output() colorChanged = new EventEmitter<[CustomMarker, Layer]>();

    deleting: Boolean = false;
    settings: Boolean = false;
    colorPicker: Boolean = false;

    colors: Color[] = [];

    constructor(private markerService: MarkerService, private colorService: ColorService) {
    }
  
    ngOnInit() {
      this.getColors();
    }

    public updateMarker(){
      let name = $('#name').val();
      let notes = $('#notes').val();        
      this.reinitMarker(name, notes);
      }

      public reinitMarker(name: string = this.name, notes: string = this.notes, colorCode: string = this.state)
      {
        let customMarker = new CustomMarker();
        customMarker.id = this.markerId;
        customMarker.name = name;
        customMarker.notes = notes;
        customMarker.latitude = this.latitude;
        customMarker.longitude = this.longitude;

        customMarker.color = this.color;
        customMarker.colorId = this.color.id;
        customMarker.color.colorCode = colorCode;

        this.markerService.updateMarker(customMarker).subscribe(() => {
            this.mapMarker.bindPopup( fl => {
                const popupEl: NgElement & WithProperties<PopupComponent> = document.createElement('popup-element') as any;
                popupEl.map = this.map;
                popupEl.mapMarker = this.mapMarker;
                popupEl.markerId = customMarker.id;
                popupEl.name = customMarker.name;
                popupEl.notes = customMarker.notes;
                popupEl.latitude = customMarker.latitude;
                popupEl.longitude = customMarker.longitude;
                return popupEl;
              })
        });
      }

      handleChange($event: ColorEvent) {
        console.log($event.color);
      }

      public toggleDeletePrompt(){
        this.deleting = !this.deleting;
      }

      public toggleSettings(){
        this.settings = !this.settings;
      }

      public toggleColorPicker(){
        this.colorPicker = !this.colorPicker;
      }

      public changeComplete(event: any){
        this.state = event.color.hex;
      }

      getColors(){
        this.colorService.getColors().subscribe((colors: Color[]) => {
          this.colors = colors;
        });
      }

      public addColor(){
        const color: Color = new Color();
        color.colorCode = this.state;
        this.colorService.addColor(color).subscribe((newColor: Color) => {
          this.colors.push(newColor);

          let customMarker: CustomMarker = new CustomMarker();
          customMarker.id = this.markerId;
          customMarker.latitude = this.latitude
          customMarker.longitude = this.longitude
          customMarker.name = this.name
          customMarker.notes = this.notes
          customMarker.colorId = color.id;;
          customMarker.color = color;

          this.colorChanged.emit([customMarker, this.mapMarker]);
          this.toggleColorPicker();
        });
      }

      public selectColor(color: Color){
        this.color = color;
        this.state = color.colorCode;

        let customMarker: CustomMarker = new CustomMarker();
        customMarker.id = this.markerId;
        customMarker.latitude = this.latitude
        customMarker.longitude = this.longitude
        customMarker.name = this.name
        customMarker.notes = this.notes
        customMarker.colorId = color.id;;
        customMarker.color = color;
        
        this.colorChanged.emit([customMarker, this.mapMarker]);
        this.reinitMarker();
      }

      public deleteColor(id: number){
        this.colorService.deleteColor(id).subscribe(() => {
          const index = this.colors.findIndex(x => x.id == id);
          this.colors.splice(index);
        });
      }

      public deleteMarker(){
        this.markerService.deleteMarker(this.markerId).subscribe(() => {
          this.map.removeLayer(this.mapMarker);
        });   
      }
  
  }