import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../../shared.module';
import { switchMap, tap } from 'rxjs';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';

@Component({
  selector: 'app-add-equipement-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './add-equipement-dialog.component.html',
  styleUrl: './add-equipement-dialog.component.scss'
})
export class AddEquipementDialogComponent {
  @Output() callback : any = new EventEmitter();
  @Input() addEquipementDialogVisible = false;
  @Input() equipement : any | null = null;
  @Output() dismiss = new EventEmitter();
  @Input() mode = 'add'

  title = "Add New Equipement";

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  categories = [];
  data_categories = [];
  sub_categories = [];
  id = '';

  constructor(
    private fb : FormBuilder,
    private _message : MessageService,
    private _stepper : AuditStepperService 
  ){}

  createEquipementForm : FormGroup; 

  ngOnInit(): void {
    this._stepper.selectedEquipement$.pipe(
      tap(v => {
        if(v){
          this.createEquipementForm.patchValue(v);
          this.id = v.id
        }
      })
    ).subscribe();
    this.fetchCategories();
    this.createEquipementForm =  this.fb.group({
      category : ['', [ Validators.required, Validators.required ]],
      subcategory : ['', Validators.required],
      ref : ['', Validators.required],
      manufacturer : ['', Validators.required],
      details : ['', Validators.required],
  })  

  this.createEquipementForm.valueChanges.pipe(
    tap(value => {
      this.sub_categories = this.data_categories.find(e => e.category == value.category)?.subs.map(e => e.label);
    })
  ).subscribe();
  }


  fetchCategories(){
    const data_category = [
      {
        category: 'Réseau et sécurité',
        subs: [
          { label: 'Equipements réseau', icon: 'photo' },
          { label: 'Equipement de sécurité', icon: 'mm photo' },
          { label: 'Réseau sans fils', description: 'Cisco Meraki, Cisco Catalyst, Aruba Instant, Aruba Central' },
          { label: 'Logiciel de sécurité SIEM', icon: 'photo' },
          { label: 'Système de sécurité physique', icon: 'photo5' }
        ]
      },
      {
        category: 'Serveurs',
        subs: [
          { label: 'Serveur de Surveillance', description: 'Nagios, Zabbix, SolarWinds' },
          { label: 'Serveur web', description: 'Apache, Nginx' },
          { label: 'Serveur de Base de Données', description: 'MySQL, PostgreSQL, Microsoft SQL Server, Oracle Database' },
          { label: 'Serveur d\'Application', description: 'Apache Tomcat' },
          { label: 'Serveur de Virtualisation', description: 'VMware esxi, vSphere, Microsoft Hyper-V, KVM, Xe' },
          { label: 'Serveur de Stockage', description: 'NAS, SAN' },
          { label: 'Serveur DNS', description: 'BIND, Microsoft DNS Server' },
          { label: 'Serveur Proxy', description: 'Squid, Microsoft ISA Server' },
          { label: 'Serveur backup', description: 'Veeam' }
        ]
      },
      {
        category: 'Service d\'annuaires (IAM Identity and Access Management Solutions)',
        subs: [
          { label: 'Active Directory' },
          { label: 'OpenLDAP' },
          { label: 'FreeIPA' },
          { label: 'Azure Active Directory' },
          { label: 'Okta' }
        ]
      },
      {
        category: 'Système d\'exploitation',
        subs: [
          { label: 'Système d\'exploitation', icon: 'photo' }
        ]
      },
      {
        category: 'Systèmes de gestion de cloud',
        subs: [
          { label: 'SUSE OpenStack' },
          { label: 'Red Hat OpenStack' },
          { label: 'Red Hat OpenShift' },
          { label: 'VMware' },
          { label: 'Microsoft Azure' },
          { label: 'Anthos de Google Cloud' },
          { label: 'AWS Outposts' }
        ]
      },
      {
        category: 'Middleware',
        subs: [
          { label: 'Middleware', icon: 'photo' }
        ]
      },
      {
        category: 'Firmware',
        subs: [
          { label: 'Firmware', icon: 'photo' }
        ]
      },
      {
        category: 'Équipements industriels',
        subs: [
          { label: 'Équipements industriels', icon: 'photo' }
        ]
      }
    ];
    this.data_categories = data_category;
    this.categories = data_category.map(e => e.category);
  }

  handleSubmit(){
    if(!this.createEquipementForm.valid){
      this._message.add({ severity: 'error', summary : 'Please fill all fields' });
      return;
    }

    const event = { data : {...this.createEquipementForm.value, id : this.id}, type : '' };
    event.type = this.mode == 'add' ? 'add' : 'update'; 

    this._stepper.addEquipement(event);
    this.createEquipementForm.reset();
    this.addEquipementDialogVisible = false;
    this._stepper.setSelectedEquiepemnt(null)
  }

  onDismiss(){
    this.createEquipementForm.reset()
    this.dismiss.emit(false);
  }
  ngOnChanges(changes: any) {
    this.title = this.mode == "add" ? "Add New Equipement" : "Update Equipement details"
  }

}
