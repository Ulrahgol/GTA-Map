import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { CustomMarker } from "../models/customMarker";
import { Account } from "../models/account";

const httpOptions = { headers: new HttpHeaders({"Content-Type": "application/json"}), };

@Injectable()
export class AccountService {

    constructor(private http: HttpClient) {}

    public login(account: Account): Observable<Account> {
        console.log(account);
        return this.http.post<Account>(`${environment.api}/Account`, account, httpOptions);
    }
}