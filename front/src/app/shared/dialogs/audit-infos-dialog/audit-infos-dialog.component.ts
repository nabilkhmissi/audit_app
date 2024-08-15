import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-audit-infos-dialog',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    AvatarGroupModule,
		AvatarModule 
  ],
  templateUrl: './audit-infos-dialog.component.html',
  styleUrl: './audit-infos-dialog.component.scss'
})
export class AuditInfosDialogComponent {
  imagesUrl = environment.userImagesUrl;

  @Input() selectedAudit : any | null = null;
  @Input() visible : boolean  = false;

  @Output() hide  = new EventEmitter()


  handleHide(){
    this.hide.emit(true);
  }
}
