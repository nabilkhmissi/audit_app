import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent implements OnInit {

  submitted = false;
  roles = ['ADMIN', 'CLIENT', 'AUDITOR'];

  newClientForm : FormGroup;
  image = "";

  constructor(
    private _user : UserService, 
    private _formBuilder : FormBuilder,
    private _toast : ToastService,
) { }

  ngOnInit() {
    this.newClientForm =  this._formBuilder.group({
        firstName : ['', Validators.required],
        lastName : ['', Validators.required],
        email : ['', Validators.required],
        phone : ['', Validators.required],
        password : ['', Validators.required],
        adresse : ['', Validators.required],
        role : ['', Validators.required],
        company : ['', Validators.required],
        gender : ['', Validators.required],
    })
  }

  handleSubmit(){
    if(!this.newClientForm.valid){
      this._toast.setError("Missing or Invalid fields, please try again !");
      this.submitted = false;
      return;
    }

    // const payload = {
    //   firstName  : this.newClientForm.value.firstName,
    //   lastName  : this.newClientForm.value.lastName,
    //   email  : this.newClientForm.value.email,
    //   password  : this.newClientForm.value.password,
    //   role  : this.newClientForm.value.role,
    //   company  : this.newClientForm.value.company,
    //   adresse  : this.newClientForm.value.adresse,
    // }
    this.submitted = true;
    this._user.createUser(this.newClientForm.value).subscribe(
      {
        next : res => this.submitted = false,
        error : err => {
          console.log(err)
          console.log("setting submitted")
          this.submitted = false
        }
      }
    );
  }

}
