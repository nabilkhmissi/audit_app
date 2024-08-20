import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
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

  selectedAuditor = [];

  constructor(
    private _user : UserService, 
    private _formBuilder : FormBuilder,
    private _toast : ToastService,
    private _audit : AuditService,
    private _message : MessageService,
    private _router : Router,
    private _auditStepper : AuditStepperService
) { }

  fetchAuditors(){
    this._user.findAllAuditors().subscribe(
        (res : any) => {
            this.filteredAuditors = res.data
        }
    )
  }
  fetchClients(){
    this._user.findAllClients().subscribe(
        (res : any) => {
            this.clients = res.data
        }
    )
  }

  ngOnInit() {
    this.fetchAuditors();
    this.fetchClients();
    this.createAuditForm =  this._formBuilder.group({
        auditors : [this.selectedAuditor.map(e=>e._id), [ Validators.required, Validators.minLength(1) ]],
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
    this._auditStepper.auditForm$.pipe(
      tap(r => {
        if(r && r.contact){
          this.createAuditForm.patchValue(r.contact)
        }
      })
    ).subscribe();
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

  handleContactSubmit(){
    if(!this.createAuditForm.valid){
      this._message.add({ severity : 'error', summary : 'Please fill all fields' });
      return;
    }
    this._auditStepper.setForm('contact', this.createAuditForm.value);
    this._router.navigate(['main/admin/add-audit-stepper/organisation']);
  }
}
