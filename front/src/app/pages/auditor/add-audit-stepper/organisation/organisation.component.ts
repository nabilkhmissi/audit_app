import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { AddEquipementDialogComponent } from 'src/app/shared/dialogs/add-equipement-dialog/add-equipement-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [
    SharedModule,
    AddEquipementDialogComponent
  ],
  templateUrl: './organisation.component.html',
  styleUrl: './organisation.component.scss'
})
export class OrganisationComponent implements OnInit{

  addEquipementDialogVisible = false;

  constructor(
    public _router : Router,
    private _auditStepper : AuditStepperService,
    private fb : FormBuilder,
    public route : ActivatedRoute,
  ){}


  oranginisationForm : FormGroup;

  ngOnInit(): void {

    this.oranginisationForm = this.fb.group({
      organisationName : ['default org name']
    })
  }

  handleSubmit(){
    this._auditStepper.setForm('oragnisation', this.oranginisationForm.value);
  }

  goBack(){
    this._auditStepper.selectedAuditID$.pipe(
      switchMap((id : string | null) => {
        if(id){
          return this._router.navigateByUrl(`/main/auditor/add-audit-stepper/${id}/contact`);
        } 
        return of(null)
      })
    ).subscribe()
  }

  showAddDialog(){

  }

  addNewEquipementCallback(event : any){
    console.log(event)
  }

}
