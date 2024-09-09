import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EquipementService } from 'src/app/services/equipements.service';
import { CustomConfirmDialogComponent } from 'src/app/shared/dialogs/custom-confirm-dialog/custom-confirm-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-equipements',
  standalone: true,
  imports: [
    SharedModule,
    CustomConfirmDialogComponent
  ],
  templateUrl: './equipements.component.html',
  styleUrl: './equipements.component.scss'
})
export class EquipementsComponent implements OnInit{

  constructor(
    private _equipements : EquipementService,
    private _message : MessageService
  ){}
  
  rawEquipements = [];
  filteredEquipements = [];
  loading = false;

  deleteEquipementLoading = null;

  getEquipements(){
    this.loading = true;
    this._equipements.findAll().subscribe(
      {
        next : (res : any)=> {
          this.loading = false;
          this.rawEquipements = res.data;
          this.filteredEquipements = this.rawEquipements;
        },
        error : (error : any)=>{
          this.loading = false;
        }
      }
    );
  }
  ngOnInit(): void {
    this.getEquipements();
  }

  handleSearch(e : any){
    this.filteredEquipements = this.rawEquipements.filter(u => u.ref.toLowerCase().includes(e.target.value.toLowerCase()) || u.category.toLowerCase().includes(e.target.value.toLowerCase()))
}

  handleEquipementDelete(){
    if(!this.deleteEquipementLoading) return;
    this._equipements.deleteEquipements(this.deleteEquipementLoading._id).subscribe(
      {
        next : (res : any) => {
          this.rawEquipements = this.rawEquipements.filter(e => e._id != res.data._id);
          this.filteredEquipements = [...this.rawEquipements];
          this.deleteEquipementLoading = null;
          this._message.add({ severity : 'success', summary : res.message })
        },
        error : (err : any) => {
          this.deleteEquipementLoading = null;
          this._message.add({ severity : 'danger', summary : err.message })
        },
        
      }
    )
  }
}
