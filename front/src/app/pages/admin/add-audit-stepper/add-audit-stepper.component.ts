import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { tap } from 'rxjs';
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

  items: MenuItem[] = [
    {
        label: 'Contact',
        routerLink: 'contact'
    },
    {
        label: 'Oragnisation',
        routerLink: 'organisation'
    },
    {
        label: 'Infrastructure',
        routerLink: 'infrastructure'
    },
    {
        label: 'Confirmation',
        routerLink: 'confirmation'
    }
];
  activatedItem = this.items[0];

  ngOnInit(): void {}

}
