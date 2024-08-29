import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
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
    private _audit : AuditService,
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
    this._auditStepper.setForm('questionnaire', this.questions)
    this.submitQuestions();
    this._auditStepper.selectedAuditID$.pipe(
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/confirmation`);
        } 
        return of(null)
      })
    ).subscribe();
  }

  fetchQuestions(){
    this._auditStepper.auditForm$.pipe(
      switchMap(v => {
        if(v && v.questionnaire){
          return of(v.questionnaire)
        }
        return   this._questionnaire.findAll().pipe(
          map((res : any) => res.data),
          map((res : any[]) => res.map(e => ({ question : e, response : null }))),
        )
      })      
    )
    .subscribe(
      res => {
        this.questions = res;
      }
    );
  }

  submitQuestions(){
    this._auditStepper.selectedAuditID$.pipe(
      switchMap((id : any) => {
        if(!id) return of(); 
        return this._audit.submitQuestions(id, this.questions)
      })
    ).subscribe()
  }

  ngOnInit(): void {
    this.fetchQuestions()
  }

  handleQuestionCheck(q : any, answer : boolean){
    const index = this.questions.findIndex(e => e.question._id === q.question._id)
    if(index == -1) return;
    this.questions[index].response = `${answer}`;
  }

}
