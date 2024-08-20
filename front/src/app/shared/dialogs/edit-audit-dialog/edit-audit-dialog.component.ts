import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { AuditService } from 'src/app/services/audit.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-audit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    ButtonModule,
    MultiSelectModule,
    DropdownModule
  ],
  templateUrl: './edit-audit-dialog.component.html',
  styleUrl: './edit-audit-dialog.component.scss'
})
export class EditAuditDialogComponent implements OnInit, OnChanges{
  
  @Input() selectedAudit : any | null = null;
  @Output() callback : any = new EventEmitter();
  @Input() editDialogVisible = false;
  @Output() dismiss = new EventEmitter();

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  filteredAuditors: any[] = [];

  selectedAuditors: any[] = [];
  clients: any[] = [];

  constructor(
    private _audit : AuditService,
    private _users : UserService,
    private fb : FormBuilder,
    private _message : MessageService
  ){}

  createAuditForm : FormGroup; 

  ngOnInit(): void {
    this.fetchAuditors();
    this.fetchClients();
    this.createAuditForm =  this.fb.group({
      auditors : ['', [ Validators.required, Validators.minLength(1) ]],
      client : ['', Validators.required],
      organisationName : [this.selectedAudit?.organisationName, Validators.required],
      contactNumber : [this.selectedAudit?.contactNumber, Validators.required],
      phoneNumber : [this.selectedAudit?.phoneNumber, Validators.required],
      website : [this.selectedAudit?.website, Validators.required],
      employeesNumber : [this.selectedAudit?.employeesNumber, Validators.required],
      employeesInPerimeter : [this.selectedAudit?.employeesInPerimeter, Validators.required],
      contactName : [this.selectedAudit?.contactName, Validators.required],
      contactEmail : [this.selectedAudit?.contactEmail, Validators.required],
  })  
  }

  fetchAuditors(){
    this._users.findAllAuditors().subscribe(
        (res : any) => {
            this.filteredAuditors = res.data
        }
    )
  }
  fetchClients(){
    this._users.findAllClients().subscribe(
        (res : any) => {
            this.clients = res.data
        }
    )
  }

  handleUpdate(){
    if(!this.createAuditForm.valid){
      this._message.add({ severity: 'error', summary : 'Please fill all fields' });
      return;
    }
    this.submitted = true;
    this._audit.updateAudit(this.selectedAudit._id,  this.createAuditForm.value).subscribe(
      {
        next : (res : any)=> {
          this._message.add({ severity: 'success', summary : res.message });
          this.submitted = false;
          this.callback.emit(res.data);
        },
        error : (err : any)=> {
          this.submitted = false;
          this._message.add({ severity: 'error', summary : err.message });
        },
      }
    )
  }

  onDismiss(){
    this.dismiss.emit(false);
  }

  ngOnChanges(changes: any) {
    if (changes.selectedAudit && this.selectedAudit) {
      this.createAuditForm.patchValue({
        ...this.selectedAudit, 
        auditors : this.selectedAudit.auditors.map(e =>e._id), 
        client : this.selectedAudit.client._id
      });
      console.log(this.createAuditForm.value)
    }
  }

}
