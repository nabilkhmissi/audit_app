import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './guards/auth.guard';
import { AuditorGuard } from './guards/auditor.guard';
import { AdminGuard } from './guards/admin.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path : '',
                redirectTo : 'landing',
                pathMatch : 'full'
            },
            {
                path : 'landing',
                loadChildren: ()=>import('./pages/landing/landing.module').then((c)=>c.LandingModule)
            },
            {
                path: 'main', component: AppLayoutComponent,
                canActivate : [AuthGuard],
                children: [
                    {
                        path : 'admin',
                        canActivate : [AuthGuard, AdminGuard],
                        children : [
                            {
                                path : '',
                                redirectTo : 'admin',
                                pathMatch : 'full'
                            },
                            {   
                                path : 'admin', loadComponent : ()=>import('./pages/admin/admin-home/admin-home.component').then((c)=>c.AdminHomeComponent)
                            },
                            {   
                                path : 'add-audit', loadComponent : ()=>import('./pages/admin/add-audit/add-audit.component').then((c)=>c.AddAuditComponent)
                            },
                            {   
                                path : 'all-audits', loadComponent : ()=>import('./pages/admin/all-audits/all-audits.component').then((c)=>c.AllAuditsComponent)
                            },
                            {   
                                path : 'users', loadComponent : ()=>import('./pages/admin/users/users.component').then((c)=>c.UsersComponent)
                            },
                            {   
                                path : 'clients', loadComponent : ()=>import('./pages/admin/clients/clients.component').then((c)=>c.ClientsComponent)
                            },
                            {   
                                path : 'add-user', loadComponent : ()=>import('./pages/admin/add-client/add-client.component').then((c)=>c.AddClientComponent), data : { role : 'AUDITOR' }
                            },
                            {   
                                path : 'add-client', loadComponent : ()=>import('./pages/admin/add-client/add-client.component').then((c)=>c.AddClientComponent), data : { role : 'CLIENT' }
                            },
                            {   
                                path : 'signup-requests', loadComponent : ()=>import('./pages/admin/signup-request/signup-request.component').then((c)=>c.SignupRequestsComponent)
                            },
                            {   
                                path : 'deleted-users', loadComponent : ()=>import('./pages/admin/deleted-users/deleted-users.component').then((c)=>c.DeletedUsersComponent)
                            },
                            {   
                                path : 'equipements', loadComponent : ()=>import('./pages/admin/equipements/equipements.component').then((c)=>c.EquipementsComponent)
                            },
                            {
                                path : 'questionnaire',
                                children : [
                                    {
                                        path : '',
                                        redirectTo : 'questions',
                                        pathMatch : 'full'
                                    },
                                    {   
                                        path : 'questions', loadComponent : ()=>import('./pages/admin/questionnaire/questions/questions.component').then((c)=>c.QuestionsComponent)
                                    },
                                    {   
                                        path : 'question-categories', loadComponent : ()=>import('./pages/admin/questionnaire/question-categories/question-categories.component').then((c)=>c.QuestionCategoriesComponent)
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        path : 'auditor',
                        canActivate : [AuthGuard, AuditorGuard],
                        children : [
                            {
                                path : '',
                                redirectTo : 'auditor',
                                pathMatch : 'full'
                            },
                            {   
                                path : 'auditor', loadComponent : ()=>import('./pages/auditor/auditor-home/auditor-home.component').then((c)=>c.AuditorHomeComponent)
                            },
                            {   
                                path : 'my-audits', loadComponent : ()=>import('./pages/auditor/my-audits/my-audits.component').then((c)=>c.MyAuditsComponent)
                            },
                            {   
                                path : 'add-audit-stepper/:id', 
                                loadComponent : ()=>import('./pages/auditor/add-audit-stepper/add-audit-stepper.component').then((c)=>c.AddAuditStepperComponent),
                                children : [
                                    {
                                        path : '',
                                        redirectTo : 'contact',
                                        pathMatch : 'full'
                                    },
                                    {   
                                        path : 'contact', loadComponent : ()=>import('./pages/auditor/add-audit-stepper/contact/contact.component').then((c)=>c.ContactComponent)
                                    },
                                    {   
                                        path : 'infrastructure', loadComponent : ()=>import('./pages/auditor/add-audit-stepper/equipements/equipements.component').then((c)=>c.EquipementComponent)
                                    },
                                    {   
                                        path : 'questionnaire', loadComponent : ()=>import('./pages/auditor/add-audit-stepper/questionnaire/questionnaire.component').then((c)=>c.QuestionnaireComponent)
                                    },
                                    {   
                                        path : 'confirmation', loadComponent : ()=>import('./pages/auditor/add-audit-stepper/audit-confirmation/audit-confirmation.component').then((c)=>c.AuditConfirmationComponent)
                                    },
                                    {   
                                        path : 'files', loadComponent : ()=>import('./pages/auditor/add-audit-stepper/files/files.component').then((c)=>c.FilesComponent)
                                    },
                                ]
                            },
                        ]
                    },
                    { path : 'unauthorized', loadComponent : ()=>import('./pages/other/not-authorized/not-authorized.component').then((c)=>c.NotAuthorizedComponent) },
                    {
                        path : 'profile',
                        loadComponent : ()=>import('./pages/profile/profile.component').then((c)=> c.ProfileComponent)
                    },
                ]
            },
            { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
