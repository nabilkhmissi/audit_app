import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
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

  selectedEquipement = null;
  dialoagMode = 'add';

  constructor(
    public _router : Router,
    private _auditStepper : AuditStepperService,
    private fb : FormBuilder,
    public route : ActivatedRoute,
  ){}


  oranginisationForm : FormGroup;

  equipementForm$ = this._auditStepper.equipementForm$;

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
    this.addEquipementDialogVisible = true;
    this.dialoagMode = 'add'
  }

  addNewEquipementCallback(event : any){
    this.addEquipementDialogVisible = false;

  }

  getKeys(obj: any): string[] {
    const keys = Object.keys(obj);
    return keys;
  }

  handleEquipementShow(item : any){
    this.selectedEquipement = item
  }

  handleEquipementEdit(item : any){
    this.dialoagMode = 'update';
    this._auditStepper.setSelectedEquiepemnt(item);
    this.addEquipementDialogVisible = true;
  }
  
  deleteEquipementFromList(item : any){
    this._auditStepper.addEquipement({ data : item, type : 'delete' });
  }
}




