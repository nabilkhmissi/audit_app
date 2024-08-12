import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { catchError, of, tap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-add-audit',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './add-audit.component.html',
  styleUrl: './add-audit.component.scss'
})
export class AddAuditComponent  implements OnInit {
   
  submitted = false;
  auditors: any[] = [];

  createAuditForm : FormGroup;

  filteredAuditors: any[] = [];
  selectedAuditors: any[] = [];

  selectedAuditor = [];

  constructor(
    private _user : UserService, 
    private _formBuilder : FormBuilder,
    private _toast : ToastService,
    private _audit : AuditService
) { }

  fetchAuditors(){
    this._user.findAllAuditors().subscribe(
        (res : any) => {
            this.filteredAuditors = res
        }
    )
  }

  ngOnInit() {
    this.fetchAuditors();
    this.createAuditForm =  this._formBuilder.group({
        auditors : [this.selectedAuditor.map(e=>e._id), [ Validators.required, Validators.minLength(1) ]],
        organisationName : ['', Validators.required],
        contactNumber : ['', Validators.required],
        phoneNumber : ['', Validators.required],
        website : ['', Validators.required],
        employeesNumber : ['', Validators.required],
        employeesInPerimeter : ['', Validators.required],
        contactName : ['', Validators.required],
        contactEmail : ['', Validators.required],
    })
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

  handleSubmit(){
    if(!this.createAuditForm.valid){
      this._toast.setError("Missing or Invalid fields, please try again !");
      this.submitted = false;
      return;
    }
    this.submitted = true;
    this._audit.createAudit(this.createAuditForm.value).pipe(
      tap(r => {
        this.submitted = false;
      }),
      catchError(err => {
        this.submitted = false;
        return of(err)
      })
    ).subscribe();
  }
}
