import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { Customer } from 'src/app/demo/api/customer';
import { AuditService } from 'src/app/services/audit.service';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuditInfosDialogComponent } from 'src/app/shared/dialogs/audit-infos-dialog/audit-infos-dialog.component';
import { ChangeAuditProgressDialogComponent } from 'src/app/shared/dialogs/change-audit-progress-dialog/change-audit-progress-dialog.component';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { EditAuditDialogComponent } from 'src/app/shared/dialogs/edit-audit-dialog/edit-audit-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-audits',
  standalone: true,
  imports: [
    SharedModule,
    CustomConfirmDialogComponent,
    AuditInfosDialogComponent,
    EditAuditDialogComponent,
    ChangeAuditProgressDialogComponent
  ],
  templateUrl: './my-audits.component.html',
  styleUrl: './my-audits.component.scss'
})
export class MyAuditsComponent {

    imagesUrl = environment.userImagesUrl;
    customers1: Customer[] = [];
    audits: any[] = [];
    filteredAudits: any[] = [];
    auditors: any[] = [];
    dialogVisible = false;
    selectedAudit : any | null = null;
    selectedAuditForProgressChange : any | null = null;

    selectedUser : any | null = null;
    editDialogVisible = false;
    progressDialogVisible = false;
    
    rowGroupMetadata: any;
    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private _audits : AuditService,
        private _auth : AuthService,
        public router : Router,
        private _stepper : AuditStepperService
    ) { }

    ngOnInit() {
        this.getAudits();
    }

    getAudits(){
        this.loading = true;
        
        this._auth.authenticatedUser$.pipe(
          switchMap(u => this._audits.findByAuditor(u.id))
        ).subscribe(
          (res : any) => {
              this.loading = false;
              this.audits = res.data; 
              this.filteredAudits = res.data; 
          }
      )
    }

    showDetails(audit : any){
        this.selectedAudit = audit;
        this.dialogVisible=true
    }
    
    handleSearch(e : any){
        this.filteredAudits = this.audits.filter(u => u.organisationName.toLowerCase().includes(e.target.value.toLowerCase()))
    }

    handleAuditUpdate(event : any){
        const index = this.audits.findIndex(u => u._id === event._id);
        this.audits[index] = event;
        this.editDialogVisible = !this.editDialogVisible;
        this.selectedUser = null;
    }

    goToStepper(id : string){
      this._stepper.clearForm()
      this.router.navigate(['/main/auditor/add-audit-stepper', id, 'contact'])
    }

    selectAuditToChnageProgress(audit : any){
      this.progressDialogVisible = true;
      this.selectedAuditForProgressChange = audit;
    }

    dismissProgressDialog(audit : any){
      this.progressDialogVisible = false;
      this.selectedAuditForProgressChange = null;
      const index = this.audits.findIndex(e => e._id === audit._id);
      if(index != -1){
        this.audits[index] = audit;
      }
    }
}
