import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, map, of, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { UserInfosDialogComponent } from 'src/app/shared/dialogs/user-infos-dialog/user-infos-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'signup-requests',
  standalone: true,
  imports: [
    SharedModule,
    CustomConfirmDialogComponent,
    UserInfosDialogComponent
  ],
  providers : [],
  templateUrl: './signup-request.component.html',
  styleUrl: './signup-request.component.scss'
})
export class SignupRequestsComponent implements OnInit{

  imagesUrl = environment.userImagesUrl;
  users : any[] = [];
  filteredUsers : any[] = [];
  rowGroupMetadata: any;
  loading: boolean = false;
  dialogVisible = false;
  selectedUser = null;

  approveLoading : string | null = null;
  deleteLoading : string | null = null;


  constructor(
    private _users : UserService,
    private _message : MessageService,
  ){}


  ngOnInit(): void {
    this.getAllDisabled();
  }

  getAllDisabled(){
    this.loading = true;
    this._users.findEnabled(false, "").pipe(
      map((r : any) => {
        return r.data.map(e => ({ ...e, image : `${environment.userImagesUrl}/${e.image}` }))
      }),
      tap((res : any) => {
        this.loading = false;
        this.users = res;
        this.filteredUsers = res
      }),
      catchError(err => {
        this.loading = false;
        return of(err)
      })
    ).subscribe()
  }

  showDetails(user : any){
    this.selectedUser = user;
    this.dialogVisible = true;
  }

  handleUserApprove(){
    this._users.enableUser(this.approveLoading).subscribe(
      {
        next : (res : any) => {
          this.users = this.users.filter(u => u._id !== this.approveLoading)
          this.clearLoading();
          this._message.add({ severity : 'success', summary : res.message })
        },
        error : (err)=>{
          this.clearLoading();
        }
      }
    )
  }

  handleUserDelete(){
    this._users.delete(this.deleteLoading).subscribe(
      {
        next : (res : any)=> {
          this.users = this.users.filter(u => u._id !== res.data._id);
          this.filteredUsers = this.users;
          this._message.add({ severity : 'success', summary : res.message })
        },
        error : (err)=>{
          this.clearLoading()
        }
      }      
    )
  }

  selectUserToApprove(id : any){
    this.approveLoading = id;
  }
  selectUserToDelete(id : any){
    this.deleteLoading = id;
  }
  
  clearLoading(){
    this.approveLoading = null;
    this.deleteLoading = null;
  }

  handleSearch(e : any){
    this.filteredUsers = this.users.filter(u => u.firstName.toLowerCase().includes(e.target.value.toLowerCase()))
  }
}
