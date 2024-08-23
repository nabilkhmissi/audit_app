import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { map, switchMap, tap } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-add-audit-stepper',
  standalone: true,
  imports: [
    SharedModule,
    StepsModule
  ],
  templateUrl: './add-audit-stepper.component.html',
  styleUrl: './add-audit-stepper.component.scss'
})
export class AddAuditStepperComponent implements OnInit{

  constructor(
    private _activatedRoute : ActivatedRoute, 
    private _audit : AuditService,
    private _auditStepper : AuditStepperService
  ){}

  items: MenuItem[] = [
    {
        label: 'Contact',
        routerLink: 'contact'
    },
    {
        label: 'Infrastructure',
        routerLink: 'organisation'
    },
    {
        label: 'Questionnaire',
        routerLink: 'infrastructure'
    },
    {
        label: 'Confirmation',
        routerLink: 'confirmation'
    }
];
  activatedItem = this.items[0];

  ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(
      switchMap((v : any) => {
        return this._audit.findById(v.params.id).pipe(
          map((res : any) => res.data),
          tap(r => {
            this._auditStepper.setForm('contact', r);
            this._auditStepper.setSelectedID(v.params.id);
          })
        )
      })
    ).    
    subscribe()
  }

}
