import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
  ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit{

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    dahsboardItems = null;

    auditPieData: any;
    auditPieOptions : any;


    constructor(
      private productService: ProductService, 
      public layoutService: LayoutService,
      private _audit : AuditService
    ) {}

    ngOnInit() {
        this.fetchNumbers();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }


    fetchNumbers(){
        this._audit.getDashboardItems().subscribe(
            (res : any) => {
                this.dahsboardItems = res.data;
                const auditLabels = ['PENDING', 'IN PROGRESS', 'FINISHED'];
                console.log(res.data.audits)
                const data = [res.data.audits.pending, res.data.audits.inProgress, res.data.audits.finished];
                this.initChart(auditLabels, data);
            }
        )
    }

    initChart(labels : any, data : any) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        this.auditPieData = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400')
                    ]
                }]
        };
        this.auditPieOptions = {
            cutout: '60%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
