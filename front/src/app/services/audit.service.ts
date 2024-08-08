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

    createAudit(data : any){
        this._http.post(`${this.baseUrl}/create`, data);
    }
    deleteAudit(id : string){
        this._http.delete(`${this.baseUrl}/delete/${id}`);
    }
    assign(data : { auditors : string[] }, id : string){
        this._http.patch(`${this.baseUrl}/assign/${id}`, data);
    }
    findByAuditor(id : string){
        this._http.get(`${this.baseUrl}/findByAuditor/${id}`);
    }
}