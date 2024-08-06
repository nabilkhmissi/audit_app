import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn : 'root'
})
export class AuditService {

    constructor(private _http : HttpClient){}

    readonly baseUrl = `${environment.apiUrl}/api/audits`;

    findAllAudits(){
        return this._http.get(`${this.baseUrl}/findAll`)
    }
}