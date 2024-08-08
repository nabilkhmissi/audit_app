import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
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
  auditors: any[] = [];

  submitted = false;
  createAuditForm : FormGroup;

  filteredAuditors: any[] = [];

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
    private _formBuilder : FormBuilder
) { }

  fetchAuditors(){
    this._user.findAllAuditors().subscribe(
        (res : any) => {
            this.filteredAuditors = res.data
        }
    )
  }

  ngOnInit() {
    this.fetchAuditors();
    this.createAuditForm =  this._formBuilder.group({
        auditors : [...this.selectedAuditor],
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

  load(){
    this.submitted = !this.submitted
  }

  handleSubmit(){
    console.log(this.createAuditForm.value)
  }
}
