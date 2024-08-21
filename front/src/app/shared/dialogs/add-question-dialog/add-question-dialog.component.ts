import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { QuestionService } from 'src/app/services/question.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-question-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule
  ],
  templateUrl: './add-question-dialog.component.html',
  styleUrl: './add-question-dialog.component.scss'
})
export class AddQuestionDialogComponent {
  @Input() selectedQuestion : any | null = null;
  @Output() callback : any = new EventEmitter();
  @Input() editDialogVisible = false;
  @Output() dismiss = new EventEmitter();

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  clients: any[] = [];
  dialogHeader = "Create new question";

  constructor(
    private fb : FormBuilder,
    private _message : MessageService,
    private _question : QuestionService,
  ){}

  createQuestionForm : FormGroup; 

  ngOnInit(): void {
    this.createQuestionForm =  this.fb.group({
      question : ['', [ Validators.required, Validators.minLength(10) ]],
  })  
  }



  handleUpdate(){
    if(!this.createQuestionForm.valid){
      this._message.add({ severity: 'error', summary : 'Please fill all fields' });
      return;
    }
    this.submitted = true;
    if(this.selectedQuestion){
      this.updateQuestion();
      return;
    }
    this.createQuestion()
    
  }

  createQuestion(){
    this._question.create(this.createQuestionForm.value).subscribe(
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

  updateQuestion(){
    this._question.update(this.selectedQuestion._id,  this.createQuestionForm.value).subscribe(
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
    this.createQuestionForm.reset();
    this.dismiss.emit(false);
  }

  ngOnChanges(changes: any) {
    if (changes.selectedQuestion && this.selectedQuestion) {
      this.dialogHeader = "Edit Question"
      this.createQuestionForm.patchValue(this.selectedQuestion);
    }
  }
}
