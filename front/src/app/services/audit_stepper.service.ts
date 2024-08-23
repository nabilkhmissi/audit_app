import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn : 'root'
})
export class AuditStepperService {
    constructor(){}


    private auditFormSubject = new BehaviorSubject<any | null>(null)
    auditForm$ = this.auditFormSubject.asObservable();
  
    private selectedAuditIDSubject = new BehaviorSubject<string | null>(null)
    selectedAuditID$ = this.selectedAuditIDSubject.asObservable();


    clearForm(){
        this.auditFormSubject.next(null);
    }

    clearSelectedID(){
        this.selectedAuditIDSubject.next(null);
    }

    setSelectedID(id : string){
        this.selectedAuditIDSubject.next(id);
    }

    setForm(title : string, data : any){
        this.auditFormSubject.next({ ...this.auditFormSubject.value, ...{ [title] : data} });
    }
}