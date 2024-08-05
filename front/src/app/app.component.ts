import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
        private _toast : ToastService,
        private _auth : AuthService,
        private _router : Router
    ) { }

    error$ = this._toast.error$;
    success$ = this._toast.success$;

    ngOnInit() {
        this.primengConfig.ripple = true;
        this._auth.autoLogin();
        this.autoLogout()
    }

    autoLogout(){
        const payload = this._auth.getAuthUser();
        if (payload && payload.token) {
          const tokenPayload = JSON.parse(atob(payload.token.split('.')[1]));
          const expirationDate = new Date(tokenPayload.exp * 1000);
          const now = new Date();
          if (expirationDate > now) {
            this._auth.autoLogout(expirationDate.getTime() - now.getTime());
          } else {
            this._auth.logout();
            this._toast.setSuccess("Token expired, you're logged out")
          }
        }
      }
}
