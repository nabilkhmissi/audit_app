import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";
import { environment } from "src/environments/environment";
import { ToastService } from "./toast.service";

@Injectable({
    providedIn : 'root'
})
export class AuditService {

    constructor(private _http : HttpClient, private _toast : ToastService){}

    readonly baseUrl = `${environment.apiUrl}/api/audits`;

    findAllAudits(){
        return this._http.get(`${this.baseUrl}/findAll`)
    }

    createAudit(data : any){
        return this._http.post(`${this.baseUrl}/create`, data).pipe(
            tap((res : any) => {
                this._toast.setSuccess(res.message)
            })
        );
    }
    deleteAudit(id : string){
        return this._http.delete(`${this.baseUrl}/delete/${id}`);
    }
    assign(data : { auditors : string[] }, id : string){
        return this._http.patch(`${this.baseUrl}/assign/${id}`, data);
    }
    findByAuditor(id : string){
        return this._http.get(`${this.baseUrl}/findByAuditor/${id}`);
    }
}