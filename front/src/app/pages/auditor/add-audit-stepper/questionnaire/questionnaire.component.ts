import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { QuestionService } from 'src/app/services/question.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit{

  questions = [];

  constructor(
    public _router : Router, 
    private _auditStepper : AuditStepperService,
    private _questionnaire : QuestionService,
  ){}

  goBack(){
    this._auditStepper.selectedAuditID$.pipe(
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/infrastructure`);
        } 
        return of(null)
      })
    ).subscribe()
  }
  goNext(){
    this._auditStepper.selectedAuditID$.pipe(
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/confirmation`);
        } 
        return of(null)
      })
    ).subscribe()
  }

  fetchQuestions(){
    this._questionnaire.findAll().subscribe(
      (res : any) => {
        this.questions = res.data
      }
    )
  }

  ngOnInit(): void {
    this.fetchQuestions();
  }

}
