import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
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
  formTitle = "";
  role = "AUDITOR";

  constructor(
    private _user : UserService, 
    private _formBuilder : FormBuilder,
    private _message : MessageService,
    private _route : ActivatedRoute,
) { }

  ngOnInit() {
    this._route.data.pipe(
      tap(data => {
        this.formTitle = `Add ${data['role'].toLowerCase()}`
        this.role = data['role'];
      })
    ).subscribe();

    this.newClientForm =  this._formBuilder.group({
        firstName : ['', Validators.required],
        lastName : ['', Validators.required],
        email : ['', Validators.required],
        phone : ['', Validators.required],
        password : ['', Validators.required],
        adresse : ['', Validators.required],
        role : [ this.role ? this.role : '' , Validators.required],
        company : ['', this.role == "CLIENT" ? Validators.required : null],
        gender : ['', Validators.required],
    })

    this.newClientForm.valueChanges.pipe(
      tap(v => {
        this.role = v.role
      })
    ).subscribe()
  }

  handleSubmit(){
    if(!this.newClientForm.valid){
      this._message.add({ severity :'error', summary : "Missing or Invalid fields, please try again !"});
      this.submitted = false;
      return;
    }
    this.submitted = true;
    this._user.createUser(this.newClientForm.value).subscribe(
      {
        next : (res: any) => {
          this._message.add({ severity : 'success', summary : res.message  })
          this.submitted = false
        },
        error : err => {
          this.submitted = false
        }
      }
    );
  }

}
