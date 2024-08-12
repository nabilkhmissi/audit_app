import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { catchError, map, of, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'signup-requests',
  standalone: true,
  imports: [
    SharedModule,
  ],
  providers : [],
  templateUrl: './signup-request.component.html',
  styleUrl: './signup-request.component.scss'
})
export class SignupRequestsComponent implements OnInit{

  imagesUrl = environment.userImagesUrl;
  users : any[] = [];
  rowGroupMetadata: any;
  loading: boolean = false;
  displayInfos = false;
  selectedUser = null;


  constructor(
    private _users : UserService,
    private confirmationService : ConfirmationService
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
        this.users = res
      }),
      catchError(err => {
        this.loading = false;
        return of(err)
      })
    ).subscribe()
  }

  onGlobalFilter(dt1, $event){

  }


  showDetails(user : any){
    this.selectedUser = user;
    this.displayInfos = true;
  }

  confirm1(id : string){
    this.confirmationService.confirm({
        key: 'confirm1',
        message: 'Are you sure to perform this action?',
        accept : ()=>{
          this._users.delete(id)
            .pipe(
              tap((r : any) => {
                this.users = this.users.filter(u => u._id !== r.data._id);
              })
            )
            .subscribe();
        },      
    });
  }
}
