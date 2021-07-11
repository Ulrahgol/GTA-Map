import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild } from "@angular/core";
import { NgElement, WithProperties } from "@angular/elements";
import { Layer, Map } from "leaflet";
import { ColorEvent } from "ngx-color";
import { ContextMenuComponent } from "ngx-contextmenu";
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
  
    @Input() mapMarker: CustomMarker;

    @Output() markerUpdated = new EventEmitter<CustomMarker>();
    @Output() markerDeleted = new EventEmitter<CustomMarker>();
    @Output() colorDeleted = new EventEmitter<[Color, Color]>();

    deleting: Boolean = false;
    settings: Boolean = false;
    colorPicker: Boolean = false;
    colorDeleting: Boolean = false;

    colorToDelete: Color;
    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

    standardColor: Color;
    colors: Color[] = [];
    colorState: string;

    constructor(private colorService: ColorService) {
    }
  
    ngOnInit() {
      this.getColors();
      this.colorState = this.mapMarker.color.colorCode
    }

    public updateMarker(){
      this.markerUpdated.emit(this.mapMarker);
    }

    public deleteMarker(){
      this.markerDeleted.emit(this.mapMarker); 
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

      public toggleColorDeleting(color: Color = new Color()){
        this.colorDeleting = !this.colorDeleting;        
        this.colorToDelete = color;
      }

      public changeComplete(event: any){
        this.colorState = event.color.hex;
      }

      getColors(){
        this.colorService.getColors().subscribe((colors: Color[]) => {
          const index = colors.findIndex(x => x.id == 1);
          this.standardColor = colors.splice(index, 1)[0];
          this.colors = colors;
        });
      }

      public addColor(){
        const color: Color = new Color();
        color.colorCode = this.colorState;
        this.colorService.addColor(color).subscribe((newColor: Color) => {
          this.colors.push(newColor);
          this.toggleColorPicker();
        });
      }

      public selectColor(color: Color){
        this.mapMarker.color = color;
        this.mapMarker.colorId = color.id;
        this.updateMarker();
      }

      public deleteColor(){
        this.colorService.deleteColor(this.colorToDelete.id).subscribe(() => {
          const index = this.colors.findIndex(x => x.id == this.colorToDelete.id);
          const deletedColor: Color = this.colors.splice(index)[0];
          this.colorDeleted.emit([deletedColor, this.standardColor]);
          this.colorDeleting = false;
        });
      }  
  }