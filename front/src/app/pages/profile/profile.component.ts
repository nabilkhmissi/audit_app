import { Component, OnInit } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SecuritySectionComponent } from './security-section/security-section.component';
import { environment } from 'src/environments/environment';
import { ProfileDetailsSectionComponent } from './profile-details-section/profile-details-section.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserImageUploadDialogComponent } from 'src/app/shared/dialogs/user-image-upload-dialog/user-image-upload-dialog.component';
import { UpdateProfileDetailsDialogComponent } from 'src/app/shared/dialogs/update-profile-details-dialog/update-profile-details-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SharedModule,
    SecuritySectionComponent,
    ProfileDetailsSectionComponent,
    UserImageUploadDialogComponent,
    UpdateProfileDetailsDialogComponent
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

  imageDialogVisible = false; 
  detailsDialogVisible = false;

  
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

  handleUpdateCallback(e : any){
    this.detailsDialogVisible=false;
    this.currentUser = { ...this.currentUser, ...e }
  }
}
