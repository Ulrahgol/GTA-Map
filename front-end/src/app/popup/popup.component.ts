import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material/table";
import { ContextMenuComponent } from "ngx-contextmenu";
import { Color } from "../models/color";
import { CustomMarker } from "../models/customMarker";
import { Image } from "../models/image";
import { ColorService } from "../services/color.service";
import { ImageService } from "../services/Image.service";
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from "../image-modal/image-modal.component";

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
    imageAdding: Boolean = false;
    imageDeleting: Boolean = false;

    imageToDelete: Image;
    imageToAdd: Image;

    colorToDelete: Color;
    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

    standardColor: Color;
    colors: Color[] = [];
    colorState: string;

    images: Image[];
    @ViewChild('#table', {static: false}) table: MatTable<any>;
    displayedColumns: string[] = ['name', 'actions'];

    constructor(private colorService: ColorService, private imageService: ImageService,
      public dialog: MatDialog) {
    }
  
    ngOnInit() {
      this.getImages();
      this.getColors();
      this.colorState = this.mapMarker.color.colorCode
      this.imageToAdd = new Image();
    }

    public updateMarker(){
      this.markerUpdated.emit(this.mapMarker);
    }

    public deleteMarker(){
      this.markerDeleted.emit(this.mapMarker); 
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

    public toggleImageAdding(){
      this.imageAdding = !this.imageAdding;
    }

    public toggleImageDeleting(image: Image = new Image()){
      this.imageToDelete = image
      this.imageDeleting = !this.imageDeleting;
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
        this.mapMarker.color = newColor;
        this.mapMarker.colorId = newColor.id;        
        this.updateMarker();
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

    getImages() {
      this.imageService.getImageByMarkerId(this.mapMarker.id).subscribe((images: Image[]) => {
        console.log(images);
        
        this.images = images;
      });
    }

    addImage() {
      this.imageToAdd.markerId = this.mapMarker.id;
      this.imageService.addImage(this.imageToAdd).subscribe((image: Image) => {
        this.images.push(image);
        this.toggleImageAdding();
      });
    }

    deleteImage() {
      const index: number = this.images.findIndex(x => x.id==this.imageToDelete.id);
      this.imageService.deleteImage(this.imageToDelete.id).subscribe(() => {
        this.toggleImageDeleting();
        this.images.splice(index,1);
      });
    }

    openImage(image: Image){
      const dialogRef = this.dialog.open(ImageModalComponent, {
        data: image,
        panelClass: 'image-modal'
      });
    }
  }