import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TabViewModule } from 'primeng/tabview';
import { switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    TabViewModule,
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  constructor(
    private _auth : AuthService, 
    private _user : UserService,
    private fb : FormBuilder
  ){}
  currentUser : any | null = null;
  passwordForm : FormGroup;

  passwordLoading = false;
  
  ngOnInit(): void {
    this.loadUser();
    this.passwordForm = this.fb.group({
      oldPassword : ['', Validators.required],
      newPassword : ['', Validators.required],
      confirmNewPassword : ['', Validators.required],
    })
  }

  loadUser(){
    this._auth.authenticatedUser$.pipe(
      switchMap(user => {
        return this._user.findById(user.id)
      })
    ).pipe(
      tap(res => {
        this.currentUser = res
      })
    ).subscribe()
  }

  handlePasswordChange(){
    this.passwordLoading = true;
    setTimeout(() => {
      this.passwordLoading = false
    }, 3000);
  }

  

}
