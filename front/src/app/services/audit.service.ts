import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { saveAs  } from 'file-saver';

@Injectable({
    providedIn : 'root'
})
export class AuditService {

    constructor(
        private _http : HttpClient, 
    ){}

    readonly baseUrl = `${environment.apiUrl}/api/audits`;

    findAllAudits(){
        return this._http.get(`${this.baseUrl}/findAll`)
    }
    findById(id : string){
        return this._http.get(`${this.baseUrl}/findById/${id}`)
    }
    findAuditContactInfosById(id : string){
        return this._http.get(`${this.baseUrl}/${id}/contact`)
    }
  
    findAuditEquipements(id : string){
        return this._http.get(`${this.baseUrl}/${id}/equipements`)
    }
 
    findAuditQuestionnaire(id : string){
        return this._http.get(`${this.baseUrl}/${id}/questionnaire`)
    }
    findAuditFiles(id : string){
        return this._http.get(`${this.baseUrl}/${id}/files`)
    }

    createAudit(data : any){
        return this._http.post(`${this.baseUrl}/create`, data);
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

    updateAudit(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/updateAudit/${id}`, data);
    }
   
    updateAuditProgress(id : string, progress : number){
        return this._http.patch(`${this.baseUrl}/${id}/progress`, { progress });
    }
   
    addEquipementToAudit(id : string, data : any){
        return this._http.patch(`${this.baseUrl}/${id}/equipements`, data);
    }
    getDashboardItems(){
        return this._http.get(`${this.baseUrl}/dashboard`);
    }
    removeEquipementFromAudit(auditId : string, equipementID : string, ){
        return this._http.delete(`${this.baseUrl}/${auditId}/equipements/${equipementID}`);
    }
    updateEquipementFromAudit(equipementID : string, data: any ){
        return this._http.patch(`${this.baseUrl}/equipements/${equipementID}`, data);
    }

    submitQuestions(auditId : string, questionnaire : any){
        const data = questionnaire.map(e => ({ question : e.question._id, response : e.response }));
        return this._http.patch<any>(`${this.baseUrl}/${auditId}/questionnaire`, {questionnaire : data})
    }

    uploadFile(auditId : string, file: File){
        const formData = new FormData();
        formData.append('file', file);
        return this._http.post(`${this.baseUrl}/${auditId}/files`, formData);
    }
    deleteFile(auditId : string, fileID: string){
        return this._http.patch(`${this.baseUrl}/${auditId}/files/${fileID}`, {});
    }
    downloadFile(file: string){
        return this._http.get(`${environment.auditFilesUrl}/${file}`, { responseType : 'blob' }).subscribe(
            (response : any) => {
                let blob: any = new Blob([response], { type: 'file' });
                saveAs(blob, file);
            }
        );
    }
}