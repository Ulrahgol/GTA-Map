import { Color } from "./Color";

export class CustomMarker {

    public id: number = 0;
    public latitude: number = 0;
    public longitude: number = 0;
    public name: string = "";
    public notes: string = "";
    public colorId: number;
    public color: Color;
}