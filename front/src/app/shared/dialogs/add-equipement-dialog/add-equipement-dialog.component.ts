import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-add-equipement-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './add-equipement-dialog.component.html',
  styleUrl: './add-equipement-dialog.component.scss'
})
export class AddEquipementDialogComponent {
  @Output() callback : any = new EventEmitter();
  @Input() addEquipementDialogVisible = false;
  @Output() dismiss = new EventEmitter();

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  constructor(
    private fb : FormBuilder,
    private _message : MessageService
  ){}

  createEquipementForm : FormGroup; 

  ngOnInit(): void {
    this.createEquipementForm =  this.fb.group({
      category : ['', [ Validators.required, Validators.required ]],
      subcategory : ['', Validators.required],
      ref : ['', Validators.required],
      details : ['', Validators.required],
  })  
  }

  handleSubmit(){
    console.log(this.createEquipementForm.value)
    // if(!this.createEquipementForm.valid){
    //   this._message.add({ severity: 'error', summary : 'Please fill all fields' });
    //   return;
    // }
    // this.submitted = true;
    // this._audit.updateAudit('this.selectedAudit._id',  this.createEquipementForm.value).subscribe(
    //   {
    //     next : (res : any)=> {
    //       this._message.add({ severity: 'success', summary : res.message });
    //       this.submitted = false;
    //       this.callback.emit(res.data);
    //     },
    //     error : (err : any)=> {
    //       this.submitted = false;
    //       this._message.add({ severity: 'error', summary : err.message });
    //     },
    //   }
    // )
  }

  onDismiss(){
    this.dismiss.emit(false);
  }

  // ngOnChanges(changes: any) {
  //   if (changes.selectedAudit && this.selectedAudit) {
  //     this.createAuditForm.patchValue({
  //       ...this.selectedAudit, 
  //       client : this.selectedAudit?.client._id,
  //       auditors : this.selectedAudit?.auditors.map(e =>e._id), 
  //     });
  //   }
  // }
}
