import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{

  users : any[] = [];
  filteredUsers : any[] = [];
  imagesUrl = environment.userImagesUrl;
  loading: boolean = false;
  deleteUserloading  : string | null = null;
  selectedUser : any | null = null;

  dialogVisible = false;


  constructor(
    private _users : UserService
  ){}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(){
    this.loading = true;
    this._users.findAll().pipe(
      tap((res : any) => {
        this.loading = false;
        this.users = res.data
        this.filteredUsers = res.data
      }),
      catchError(err => {
        this.loading = false;
        return of(err)
      })
    ).subscribe()
  }


  handleSearch(e : any){
    this.filteredUsers = this.users.filter(u => u.firstName.toLowerCase().includes(e.target.value.toLowerCase()))
  }

  selectUserToDelete(id : string){
    this.deleteUserloading = id;
  }

  handleUserDelete(){
    this._users.delete(this.deleteUserloading).subscribe({
      next : (res)=> {
        this.filteredUsers = this.filteredUsers.filter(u => u._id !== this.deleteUserloading)
        this.clearLoading()
      },
      error : (err)=> {
        this.clearLoading()
      }
    })
  }

  clearLoading(){
    this.deleteUserloading = null;
  }

  showDetails(user){
    this.dialogVisible = !this.dialogVisible;
    this.selectedUser = user;
  }
}
