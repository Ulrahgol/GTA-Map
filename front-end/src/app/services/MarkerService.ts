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
        return this.http.post<CustomMarker>(`${environment.api}/Markers`, customMarker, httpOptions);
    }

    public updateMarker(customMarker: CustomMarker): Observable<CustomMarker> {
        return this.http.post<CustomMarker>(`${environment.api}/Markers/${customMarker.id}`, customMarker, httpOptions);
    }

    public deleteMarker(latitude: number, longitude: number): Observable<CustomMarker> {
        return this.http.delete<CustomMarker>(`${environment.api}/Markers/${latitude}/${longitude}`, httpOptions);
    }
}