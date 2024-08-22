import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './organisation.component.html',
  styleUrl: './organisation.component.scss'
})
export class OrganisationComponent implements OnInit{

  constructor(
    public router : Router,
    private _auditStepper : AuditStepperService,
    private fb : FormBuilder
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

}
