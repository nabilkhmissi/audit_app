import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn : 'root'
})
export class AuditStepperService {
    constructor(){}


    auditFormSubject = new BehaviorSubject<any | null>(null)
    auditForm$ = this.auditFormSubject.asObservable();


    clearForm(){
        this.auditFormSubject.next(null);
    }

    setForm(title : string, data : any){
        this.auditFormSubject.next({ ...this.auditFormSubject.value, ...{ [title] : data} });
    }
}