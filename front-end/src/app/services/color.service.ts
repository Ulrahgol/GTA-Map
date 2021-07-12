import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { Color } from "../models/color";

const httpOptions = { headers: new HttpHeaders({"Content-Type": "application/json"}), };

@Injectable()
export class ColorService {

    constructor(private http: HttpClient) {}

    public getColors(): Observable<Color[]> {
        return this.http.get<Color[]>(`${environment.api}/Color`, httpOptions);
    }

    public getColorById(id: number): Observable<Color[]> {
        return this.http.get<Color[]>(`${environment.api}/Color/${id}`, httpOptions);
    }

    public addColor(color: Color): Observable<Color> {
        return this.http.post<Color>(`${environment.api}/Color`, color, httpOptions);
    }

    public deleteColor(id: number): Observable<Color> {
        return this.http.delete<Color>(`${environment.api}/Color/${id}`, httpOptions);
    }
}