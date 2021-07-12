import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { CustomMarker } from "../models/customMarker";

const httpOptions = { headers: new HttpHeaders({"Content-Type": "application/json"}), };

@Injectable()
export class MarkerService {

    constructor(private http: HttpClient) {}

    public getMarkers(): Observable<CustomMarker[]> {
        return this.http.get<CustomMarker[]>(`${environment.api}/Markers`, httpOptions);
    }

    public makeMarker(customMarker: CustomMarker): Observable<CustomMarker> {
        const marker = {
            id: customMarker.id,
            latitude: customMarker.latitude,
            longitude: customMarker.longitude,
            name: customMarker.name,
            notes: customMarker.notes,
            colorId: customMarker.colorId,
            color: customMarker.color,
        };
        return this.http.post<CustomMarker>(`${environment.api}/Markers`, marker, httpOptions);
    }

    public updateMarker(customMarker: CustomMarker): Observable<CustomMarker> {
        const marker = {
            id: customMarker.id,
            latitude: customMarker.latitude,
            longitude: customMarker.longitude,
            name: customMarker.name,
            notes: customMarker.notes,
            colorId: customMarker.colorId,
            color: customMarker.color,
        };
        return this.http.post<CustomMarker>(`${environment.api}/Markers/${marker.id}`, marker, httpOptions);
    }

    public deleteMarker(id: number): Observable<CustomMarker> {
        return this.http.delete<CustomMarker>(`${environment.api}/Markers/${id}`, httpOptions);
    }
}