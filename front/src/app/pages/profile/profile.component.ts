import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TabViewModule } from 'primeng/tabview';
import { map, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SecuritySectionComponent } from './security-section/security-section.component';
import { environment } from 'src/environments/environment';
import { ProfileDetailsSectionComponent } from './profile-details-section/profile-details-section.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SharedModule,
    SecuritySectionComponent,
    ProfileDetailsSectionComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  constructor(
    private _auth : AuthService, 
    private _user : UserService,
  ){}
  currentUser : any | null = null;

  
  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(){
    this._auth.authenticatedUser$.pipe(
      switchMap(user => {
        return this._user.findById(user.id)
      })
    ).pipe(
      map((res : any) => ({ ...res.data, image : `${environment.userImagesUrl}/${res.data.image}` })),
      tap(res => {
        this.currentUser = res;
      })
    ).subscribe()
  }
}
