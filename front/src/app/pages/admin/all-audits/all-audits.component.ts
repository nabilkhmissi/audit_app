import { Component, ElementRef, ViewChild } from '@angular/core';
import { Customer } from 'src/app/demo/api/customer';
import { AuditService } from 'src/app/services/audit.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-audits',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './all-audits.component.html',
  styleUrl: './all-audits.component.scss'
})
export class AllAuditsComponent {

    imagesUrl = environment.userImagesUrl;
    customers1: Customer[] = [];
    audits: any[] = [];
    auditors: any[] = [];
    
    rowGroupMetadata: any;
    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private _audits : AuditService,
        private _user : UserService
    ) { }

    ngOnInit() {
        this.getAudits();
        this.loadAllAuditors();
    }

    getAudits(){
        this.loading = true;
        this._audits.findAllAudits()
        .subscribe(
            (res : any) => {
                this.loading = false;
                this.audits = res.data; 
            }
        )
    }

    loadAllAuditors(){
        this._user.findAllAuditors().subscribe(
            (res : any) => {
                this.auditors = res.data
            }
        )
    }

    showDetails(){

    }

    delete(){

    }
    onGlobalFilter(dt1, $event){
        
    }
}
