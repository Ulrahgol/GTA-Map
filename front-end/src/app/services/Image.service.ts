import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { Image } from "../models/image";

const httpOptions = { headers: new HttpHeaders({"Content-Type": "application/json"}), };

@Injectable()
export class ImageService {

    constructor(private http: HttpClient) {}

    public getImageByMarkerId(id: number): Observable<Image[]> {
        return this.http.get<Image[]>(`${environment.api}/Image/${id}`, httpOptions);
    }

    public addImage(image: Image): Observable<Image> {
        return this.http.post<Image>(`${environment.api}/Image`, image, httpOptions);
    }

    public deleteImage(id: number): Observable<Image> {
        return this.http.delete<Image>(`${environment.api}/Image/${id}`, httpOptions);
    }
}