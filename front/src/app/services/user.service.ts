import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn : 'root'
})
export class UserService {

    constructor(private _http : HttpClient){}

    readonly baseUrl = `${environment.apiUrl}/api/users`;

    findAll(){
        return this._http.get(`${this.baseUrl}/findAll`)
    }
    findAllAuditors(){
        return this._http.get(`${this.baseUrl}/findAllAuditors`)
    }
    findAllClients(){
        return this._http.get(`${this.baseUrl}/findAllClients`)
    }

    findById(id : string){
        return this._http.get(`${this.baseUrl}/findById/${id}`);
    }
    enableUser(id : string){
        return this._http.patch(`${this.baseUrl}/enable/${id}`, {});
    }
    findEnabled(enabled : boolean, role : string){
        return this._http.get(`${this.baseUrl}/findEnabled?enabled=${enabled}&role=${role}`);
    }
    updateDetails(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/updateDetails/${id}`, data);
    }
    changePassword(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/changePassword/${id}`, data);
    }
    updateImage(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/updateImage/${id}`, data);
    }
    createUser(data : any){
        return this._http.post(`${this.baseUrl}/createUser`, data);
    }
    delete(id : string){
        return this._http.delete(`${this.baseUrl}/delete/${id}`);
    }
}