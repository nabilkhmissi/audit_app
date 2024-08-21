import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { QuestionService } from 'src/app/services/question.service';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-add-question-category-dialog',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './add-question-category-dialog.component.html',
  styleUrl: './add-question-category-dialog.component.scss'
})
export class AddQuestionCategoryDialogComponent {
  @Input() selectedCategory : any | null = null;
  @Output() callback : any = new EventEmitter();
  @Input() editDialogVisible = false;
  @Output() dismiss = new EventEmitter();

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  dialogHeader = "Create new category";

  constructor(
    private fb : FormBuilder,
    private _message : MessageService,
    private _question : QuestionService,
  ){}

  createCategoryForm : FormGroup; 

  ngOnInit(): void {
    this.createCategoryForm =  this.fb.group({
      label : ['', [ Validators.required, Validators.required ]],
      subcategories : [''],
  })  
  }



  handleAdd(){
    if(!this.createCategoryForm.valid){
      this._message.add({ severity: 'error', summary : 'Please fill all fields' });
      return;
    }
    console.log(this.createCategoryForm.value);
    this.submitted = true;
    if(this.selectedCategory){
      this.updateCategory();
      return;
    }
    this.createCategory()
    
  }

  createCategory(){
    this._question.createCategory(this.createCategoryForm.value).subscribe(
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

  updateCategory(){
    this._question.updateCategory(this.selectedCategory._id,  this.createCategoryForm.value).subscribe(
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
    this.createCategoryForm.reset();
    this.dismiss.emit(false);
  }

  ngOnChanges(changes: any) {
    if (changes.selectedCategory && this.selectedCategory) {
      this.dialogHeader = "Edit Category";
      this.createCategoryForm.patchValue(this.selectedCategory);
    }
  }
}
