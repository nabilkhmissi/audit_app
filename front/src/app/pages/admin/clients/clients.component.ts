import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit{


  clients : any[] = [];
  loading: boolean = false;


  constructor(
    private _users : UserService
  ){}

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients(){
    this.loading = true;
    this._users.findAllClients().pipe(
      tap((res : any) => {
        this.loading = false;
        this.clients = res.data
      }),
      catchError(err => {
        this.loading = false;
        return of(err)
      })
    ).subscribe()
  }

}
