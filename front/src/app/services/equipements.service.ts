import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class EquipementService {

    constructor(
        private _http : HttpClient, 
    ){}

    readonly baseUrl = `${environment.apiUrl}/api/equipements`;


    searchEquipement(data : { manufacturer  : string, ref : string }){
        return this._http.post(`${this.baseUrl}/search`, data)
    }


  }