import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent{

    authenticated$ =  this._auth.isAuthenticated$;

    constructor(
        public layoutService: LayoutService, 
        public router: Router,
        private _auth : AuthService
    ) { }

    logout(){
        this._auth.logout()
    }
}
