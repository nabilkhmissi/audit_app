import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { QuestionService } from 'src/app/services/question.service';
import { AddQuestionDialogComponent } from 'src/app/shared/dialogs/add-question-dialog/add-question-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
   SharedModule,
   AddQuestionDialogComponent
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent {
  imagesUrl = environment.userImagesUrl;
  questions: any[] = [];
  filteredQuestions: any[] = [];

  questionDeleteLoading  : string | null = null;

  dialogVisible = false;

  selectedQuestion : any | null = null;

  selectedUser : any | null = null;

  editDialogVisible = false;
  
  loading: boolean = true;

  constructor(
      private _questionnaire : QuestionService,
      private _message : MessageService
  ) { }

  ngOnInit() {
      this.getQuestions();
  }

  getQuestions(){
      this.loading = true;
      this._questionnaire.findAll()
      .subscribe(
          (res : any) => {
              this.loading = false;
              this.questions = res.data; 
              this.filteredQuestions = res.data; 
          }
      )
  }

  showDetails(audit : any){
      this.selectedQuestion = audit;
  }

  selectAuditToDelete(id : string){
      this.questionDeleteLoading = id;
  }
  handleQuestionDelete(){
      this._questionnaire.delete(this.questionDeleteLoading).subscribe(
          {
              next : (res : any)=> {
                  this.questions = this.questions.filter(a => a._id != res.data._id)
                  this.filteredQuestions = this.questions;
                  this.clearLoading();
                  this._message.add({ severity : 'success', summary : res.message })
              },
              error : (err)=> this.clearLoading()
          }
      )
  }

  clearLoading(){
      this.questionDeleteLoading = null;
  }

  handleSearch(e : any){
      this.filteredQuestions = this.questions.filter(u => u.organisationName.toLowerCase().includes(e.target.value.toLowerCase()))
  }

  handleAuditUpdate(event : any){
      const index = this.questions.findIndex(u => u._id === event._id);
      this.questions[index] = event;
      this.editDialogVisible = !this.editDialogVisible;
      this.selectedUser = null;
  }
}
