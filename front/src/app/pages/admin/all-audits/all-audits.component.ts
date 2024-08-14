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
    filteredAudits: any[] = [];
    auditors: any[] = [];
    auditDeleteLoading  : string | null = null;
    
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
                this.filteredAudits = res.data; 
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

    selectAuditToDlete(id : string){
        this.auditDeleteLoading = id;
    }
    handleAuditDelete(){
        this._audits.deleteAudit(this.auditDeleteLoading).subscribe(
            {
                next : (res)=> {
                    this.audits = this.audits.filter(a => a._id !== this.auditDeleteLoading)
                    this.clearLoading();
                },
                error : (err)=> this.clearLoading()
            }
        )
    }

    clearLoading(){
        this.auditDeleteLoading = null;
    }

    handleSearch(e : any){
        this.filteredAudits = this.audits.filter(u => u.organisationName.toLowerCase().includes(e.target.value.toLowerCase()))
    }
}
