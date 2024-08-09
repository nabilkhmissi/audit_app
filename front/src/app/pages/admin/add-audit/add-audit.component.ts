import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { AuditService } from 'src/app/services/audit.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-add-audit',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './add-audit.component.html',
  styleUrl: './add-audit.component.scss'
})
export class AddAuditComponent  implements OnInit {
   
  countries: any[] = [];
  submitted = false;
  auditors: any[] = [];

  brands: any[] = []; 
  selectedBrands: any[] = [];

  createAuditForm : FormGroup;

  filteredAuditors: any[] = [];
  selectedAuditors: any[] = [];

  selectedCountryAdvanced: any[] = [];

  valSlider = 50;

  valColor = '#424242';

  selectedAuditor = [];

  valRadio: string = '';

  valCheck: string[] = [];

  valCheck2: boolean = false;

  valSwitch: boolean = false;

  cities: SelectItem[] = [];

  selectedList: SelectItem = { value: '' };

  selectedDrop: SelectItem = { value: '' };

  selectedMulti: any[] = [];

  valToggle = false;

  paymentOptions: any[] = [];

  valSelect1: string = "";

  valSelect2: string = "";

  valueKnob = 20;

  constructor(
    private _user : UserService, 
    private _formBuilder : FormBuilder,
    private _toast : ToastService,
    private _audit : AuditService
) { }

  fetchAuditors(){
    this._user.findAllAuditors().subscribe(
        (res : any) => {
            this.filteredAuditors = res
        }
    )
  }

  ngOnInit() {
    this.fetchAuditors();
    this.createAuditForm =  this._formBuilder.group({
        auditors : this.selectedAuditor.map(e=>e._id),
        organisationName : [''],
        contactNumber : [''],
        phoneNumber : [''],
        website : [''],
        employeesNumber : [''],
        employeesInPerimeter : [''],
        contactName : [''],
        contactEmail : [''],
    })
  }
  filterAuditors(event: any) {
      const filtered: any[] = [];
      const query = event.query;
      for (let i = 0; i < this.auditors.length; i++) {
          const auditor = this.auditors[i];
          if (auditor.firstName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(auditor);
          }
      }
      this.filteredAuditors = filtered;
  }

  handleSubmit(){
    if(!this.createAuditForm.valid){
      this._toast.setError("Missing or Invalid fields, please try again !");
      this.submitted = false;
      return;
    }
    this.submitted = true;
    this._audit.createAudit(this.createAuditForm.value).subscribe(
      res => {
        this.submitted = false;
      }
    );
  }
}
