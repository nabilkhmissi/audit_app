import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit{
  auditors: any[] = [];
  clients: any[] = [];
  imagesUrl = environment.userImagesUrl;

  createAuditForm : FormGroup;

  filteredAuditors: any[] = [];

  selectedAuditors: any[] = [];
  selectedClient : any| null = null; 

  constructor(
    private _formBuilder : FormBuilder,
    private _router : Router,
    private _auditStepper : AuditStepperService,
) { }

  ngOnInit() {
    this.initForm();
    this._auditStepper.auditForm$.pipe(
      tap(r => {
        if(r && r.contact){
          this.selectedAuditors = r.contact.auditors;
          this.selectedClient = r.contact.client;
          this.createAuditForm.patchValue({
            ...r.contact,
            auditors : r.contact.auditors.map(e =>`${e.firstName} ${e.lastName}`),
            client : r.contact.client.firstName
          });
        }
      })
    ).subscribe();
  }

  initForm(){
    this.createAuditForm =  this._formBuilder.group({
      auditors : ['', [ Validators.required, Validators.minLength(1) ]],
      client : ['', Validators.required],
      organisationName : ['', Validators.required],
      contactNumber : ['', Validators.required],
      phoneNumber : ['', Validators.required],
      website : ['', Validators.required],
      employeesNumber : ['', Validators.required],
      employeesInPerimeter : ['', Validators.required],
      contactName : ['', Validators.required],
      contactEmail : ['', Validators.required],
  });
  this.createAuditForm.disable();
  }
  filterAuditors(event: any) {
      const filtered: any[] = [];
      const query = event.query;
      for (let i = 0; i < this.auditors.length; i++) {
          const auditor = this.auditors[i];
          if (auditor.firstName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(auditor);
          }
      }
      this.filteredAuditors = filtered;
  }

  goNext(){
    this._auditStepper.setForm('contact', {
      ...this.createAuditForm.value, 
      auditors : this.selectedAuditors, 
      client : this.selectedClient 
    });

    this._auditStepper.selectedAuditID$.pipe(
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/infrastructure`);
        } 
        return of(null)
      })
    ).subscribe()
  }
}
