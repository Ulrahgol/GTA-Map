import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Image } from "../models/image";

@Component({
    selector: 'image-modal',
    templateUrl: './image-modal.component.html',
    styleUrls: ['./image-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class ImageModalComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: Image) {}
    
    // @Input() imageSrc: string;
  
  }