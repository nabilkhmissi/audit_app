import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, map, of, switchMap } from 'rxjs';
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

  equipements : any = [];
  groupedEquipements : any = [];
  selectedEquipement = null;

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
    this.addEquipementDialogVisible = true;
  }

  addNewEquipementCallback(equipement : any){

    this.addEquipementDialogVisible = false;

    const category = equipement.category;

    if(!this.equipements[category]){
      this.equipements[category] = [];
    }
    this.equipements = [...this.equipements, equipement];
    this.groupEquipements();

  }
  groupEquipements(){
    this.groupedEquipements = [];
    for (let i = 0; i < this.equipements.length; i++) {
      const element = this.equipements[i];
      const cat = element.category;
      if (!this.groupedEquipements[cat]) {
        this.groupedEquipements[cat] = [];
      }
      this.groupedEquipements[cat] = [...this.groupedEquipements[cat], element];
    }
  }

  deleteEquipementFromList(index : any){
    this.equipements.splice(index, 1);
    this.equipements = [...this.equipements];
    this.groupEquipements();
    this.selectedEquipement = null;
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  handleEquipementShow(item : any){
    this.selectedEquipement = item
  }
}




