import { LatLngExpression, LatLngTuple, Marker, MarkerOptions } from "leaflet";
import { Color } from "./color";

export class CustomMarker extends Marker {

    constructor(latlng: LatLngTuple, options?: MarkerOptions, id = 0, name = "", notes = "", colorId = 1, color = new Color()){
        super(latlng, options);
        this.id = id;
        this.latitude = latlng[0];
        this.longitude = latlng[1];
        this.name = name;
        this.notes = notes;
        this.colorId = colorId;
        this.color = color;
    }

    public id: number = 0;
    public latitude: number = 0;
    public longitude: number = 0;
    public name: string = "";
    public notes: string = "";
    public colorId: number;
    public color: Color;
}