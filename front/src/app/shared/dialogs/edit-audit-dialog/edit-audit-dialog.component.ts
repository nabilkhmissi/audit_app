import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuditService } from 'src/app/services/audit.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-audit-dialog',
  standalone: true,
  imports: [],
  templateUrl: './edit-audit-dialog.component.html',
  styleUrl: './edit-audit-dialog.component.scss'
})
export class EditAuditDialogComponent {
  
  @Input() selectedAudit : any | null = null;
  @Output() callback : any = new EventEmitter();
  @Input() editDialogVisible = false;
  @Output() dismiss = new EventEmitter();

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  filteredAuditors: any[] = [];
  selectedAuditors: any[] = [];

  constructor(
    private _audit : AuditService,
    private _users : UserService,
    private fb : FormBuilder,
    private _message : MessageService
  ){}

  createAuditForm : FormGroup; 

  ngOnInit(): void {
    this.createAuditForm =  this.fb.group({
      auditors : [this.selectedAuditors.map(e=>e._id) || '', [ Validators.required, Validators.minLength(1) ]],
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

  fetchAuditors(){
    this._users.findAllAuditors().subscribe(
        (res : any) => {
            this.filteredAuditors = res.data
        }
    )
  }

  handleUpdate(){
    // this.callback.emit(this.userForm.value);
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
      this.createAuditForm.patchValue(this.selectedAudit);
    }
  }

}
