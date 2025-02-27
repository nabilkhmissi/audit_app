import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../../shared.module';
import { debounceTime, map, switchMap, take, tap } from 'rxjs';
import { AuditStepperService } from 'src/app/services/audit_stepper.service';
import { AuditService } from 'src/app/services/audit.service';
import { EquipementService } from 'src/app/services/equipements.service';

@Component({
  selector: 'app-add-equipement-dialog',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './add-equipement-dialog.component.html',
  styleUrl: './add-equipement-dialog.component.scss'
})
export class AddEquipementDialogComponent implements OnChanges{
  @Output() callback : any = new EventEmitter();
  @Input() addEquipementDialogVisible = false;
  @Input() selectedEquipement : any | null = null;
  @Output() dismiss = new EventEmitter();
  @Input() mode = ''

  title = "Add New Equipement";

  imagesUrl = environment.userImagesUrl;
  submitted = false;

  categories = [];
  data_categories = [];
  sub_categories = [];
  suggestedEquipements = [];
  id = '';

  constructor(
    private fb : FormBuilder,
    private _message : MessageService,
    private _stepper : AuditStepperService,
    private _audit : AuditService,
    private _equipement : EquipementService,

  ){}

  createEquipementForm : FormGroup; 

  ngOnInit(): void {
    this.createEquipementForm =  this.fb.group({
      category : ['', [ Validators.required, Validators.required ]],
      subcategory : ['', Validators.required],
      ref : ['', Validators.required],
      manufacturer : ['', Validators.required],
      details : ['', Validators.required],
    })  
    
    this._stepper.selectedEquipement$.pipe(
      tap(v => {
        if(v){
          this.mode = 'update';
          this.id = v._id;
          this.createEquipementForm.patchValue(v);
        }
      })
    ).subscribe();
    this.fetchCategories();

  this.createEquipementForm.valueChanges.pipe(
    debounceTime(500),
    map(value => {
      if(value.ref && value.ref._id){
        const formValue = {
          ref : value.ref.ref, 
          manufacturer : value.ref.manufacturer, 
          category : value.ref.category, 
          subcategory : value.ref.subcategory, 
          details : value.ref.details
        };
        this.createEquipementForm.patchValue(formValue)
        return formValue;
      }
      return value;
    }),
    tap((value : any) => {
      this.sub_categories = this.data_categories.find(e => e.category == value.category)?.subs.map(e => e.label)
    }),
    switchMap(value => {
      return this._equipement.searchEquipement({ manufacturer : value.manufacturer, ref : value.ref })
    })
  ).subscribe(
    (res : any) => {
      this.suggestedEquipements = this.groupEquipementsByCategory(res.data);
    }
  );
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
    this._stepper.selectedAuditID$.pipe(
      take(1),
      switchMap(id => {
        if(id && this.mode == 'add'){
          return this._audit.addEquipementToAudit(id, this.createEquipementForm.value).pipe(
            tap((res : any) => {
              this.callback.emit({data : res.data, action : 'add'});
              this.addEquipementDialogVisible = false;
              this._message.add({ severity : 'success', summary : res.message })
            })
          )
        }else{
          return this._audit.updateEquipementFromAudit(this.id, this.createEquipementForm.value).pipe(
            tap((res : any) => {
              this.callback.emit({data : res.data, action : 'update'});
               this.addEquipementDialogVisible = false;
               this._message.add({ severity : 'success', summary : res.message })
            })
          )
        }
      })
    ).subscribe()
  }

  onDismiss(){
    this.createEquipementForm.reset()
    this.dismiss.emit(false);
  }

  ngOnChanges(changes : any){
    if(changes.mode){
      this.mode = changes.mode.currentValue;
    }
  }

  groupEquipementsByCategory(equipements : any[]){
    let grouped = [];
    for (let i = 0; i < equipements.length; i++) {
      const element = equipements[i];
      const category = element.category;
      if(!grouped[category]){
        grouped[category] = [];
      }
      grouped[category].push(element);
    }

    return Object.keys(grouped).map(key => ({
      category: key,
      icon : this.setCatgeoryIcon(key),
      items: grouped[key]
    }));
  }

  setCatgeoryIcon(key : string){
    switch (key) {
      case 'Réseau et sécurité':
        return 'pi pi-sitemap'
      case 'Serveurs':
        return 'pi pi-server'
      case 'Service d\'annuaires (IAM Identity and Access Management Solutions)':
        return 'pi pi-lock'
      case 'Système d\'exploitation':
        return 'pi pi-microsoft'
      case 'Systèmes de gestion de cloud':
        return 'pi pi-cloud'
      case 'Middleware':
        return 'pi pi-code'
      case 'Firmware':
        return 'pi pi-code'
      case 'Équipements industriels':
        return 'pi pi-cog'
      default:
        return 'pi-angle-right'
    }
  }
}
