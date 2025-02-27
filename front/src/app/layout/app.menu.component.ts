import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    role : string | null = null;

    constructor(
        public layoutService: LayoutService,
        private _auth : AuthService    
    ) { }

    ngOnInit() {
        this._auth.authenticatedUser$.pipe(
            tap(data => {
                if(data){
                    this.role = data.role;
                }
            })
        ).subscribe();

        this.model = [
            {
                label: 'Admin',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['admin'] },
                    {
                        label : 'Users', 
                        items : [
                            { label: 'All users', icon: 'pi pi-fw pi-users', routerLink: ['admin/users'] },
                            { label: 'Add user', icon: 'pi pi-fw pi-user-plus', routerLink: ['admin/add-user'] },
                            { label: 'Signup requests', icon: 'pi pi-users', routerLink: ['admin/signup-requests'] },
                            { label: 'Deleted users', icon: 'pi pi-user-minus', routerLink: ['admin/deleted-users'] },
                        ]
                    },
                    {
                        label : 'Clients',
                        items : [
                            { label: 'Clients', icon: 'pi pi-users', routerLink: ['admin/clients'] },
                            { label: 'Add client', icon: 'pi pi-user-plus', routerLink: ['admin/add-client'] }
                        ]
                    },
                    {
                        label : 'Audits',
                        items : [
                            { label: 'All audits', icon: 'pi pi-users', routerLink: ['admin/all-audits'] },
                            { label: 'Add audit', icon: 'pi pi-user-plus', routerLink: ['admin/add-audit'] },
                            { 
                                label: 'Questionnaire', 
                                icon: 'pi pi-question-circle', 
                                items : [
                                    { label: 'Questions', icon: 'pi pi-question', routerLink: ['admin/questionnaire/questions'] },
                                    { label: 'Question categories', icon: 'pi pi-question', routerLink: ['admin/questionnaire/question-categories'] },
                                ]
                            },
                            { label: 'Equipements', icon: 'pi pi-cog', routerLink: ['admin/equipements'] },
                        ]
                    },
                ],
                roles : ["ADMIN"]
            },
            {
                label: 'Auditor',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['auditor/auditor'] },
                    { label: 'My audits', icon: 'pi pi-fw pi-users', routerLink: ['auditor/my-audits'] },
                    // { 
                    //     label: 'Add audit stepper', 
                    //     icon: 'pi pi-user-plus', 
                    //     routerLink: ['auditor/add-audit-stepper'],
                    //  },
                    
                ],
                roles : ["AUDITOR"]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['pages/crud']
                    },
                    {
                        label: 'Timeline',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['pages/timeline']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['pages/empty']
                    },
                ],
                roles : ["ADMIN, AUDITOR, CLIENT"]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                        ]
                    }
                ],
                roles : ["ADMIN, AUDITOR, CLIENT"]
            }
        ];
    }
}
