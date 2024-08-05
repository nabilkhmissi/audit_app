import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './guards/auth.guard';

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
                children: [
                    {
                        path : 'admin',
                        canActivate : [AuthGuard],
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
                                path : 'users', loadComponent : ()=>import('./pages/admin/users/users.component').then((c)=>c.UsersComponent)
                            },
                            {   
                                path : 'clients', loadComponent : ()=>import('./pages/admin/clients/clients.component').then((c)=>c.ClientsComponent)
                            },
                            {   
                                path : 'add-user', loadComponent : ()=>import('./pages/admin/add-user/add-user.component').then((c)=>c.AddUserComponent)
                            },
                            {   
                                path : 'add-client', loadComponent : ()=>import('./pages/admin/add-client/add-client.component').then((c)=>c.AddClientComponent)
                            },
                        ]
                    },
                    {
                        path : 'auditor',
                        canActivate : [AuthGuard],
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
                        ]
                    },
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    {
                        path : 'profile',
                        loadComponent : ()=>import('./pages/profile/profile.component').then((c)=> c.ProfileComponent)
                    },
                ]
            },
            { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
            { path: 'notfound', component: NotfoundComponent },
            // { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
