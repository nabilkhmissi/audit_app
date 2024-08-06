import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { LoadingService } from "./loading.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../models/api_response";
import { AuthRequest } from "../models/auth_request";
import { RegisterRequest } from "../models/register_request";
import { AuthResponse } from "../models/auth_response";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = `${environment.apiUrl}/api/auth`;

  isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  authenticatedUser = new BehaviorSubject<AuthResponse | null>(null);
  authenticatedUser$ = this.authenticatedUser.asObservable();

  readonly AUDIT_APP_KEY = "audit_app_prologic"
  private tokenExpirationTimer: any;


  getAuthUser(){
    return this.authenticatedUser.value;
  }

  constructor(private _http: HttpClient,
    private _loading: LoadingService,
    private _router: Router,
    private _toast : ToastService
  ) { }

  login(auth: AuthRequest) {
    this._loading.showLoading();
    return this._http.post<ApiResponse>(`${this.baseUrl}/login`, auth).pipe(
      tap(response => {
        this.saveAuthToLS(response.data)
        this.isAuthenticated.next(true);
        this.authenticatedUser.next(response.data);
        this._loading.hideLoading();
        this._router.navigate(['/main'])
        const role = response.data.role;
        switch (role) {
          case "ADMIN":
            break;
          // case "AUDITOR":
          //   this._router.navigate(['/auditor'])
          //   break;
          // case "CLIENT":
          //   this._router.navigate(['/client'])
          //   break;
          //   default:
          //   this._router.navigate(['/auth'])
          //   break;
        }
      })
    )
  }
  signup(data: RegisterRequest) {
    this._loading.showLoading();
    return this._http.post<ApiResponse>(`${this.baseUrl}/signup`, data).pipe(
      tap(response => {
        this._loading.hideLoading();
      })
    )
  }

  register(auth: RegisterRequest) {
    this._loading.showLoading();
    return this._http.post<ApiResponse>(`${this.baseUrl}/register`, auth).pipe(
      tap(response => {
              this.saveAuthToLS(response.data)
             this.isAuthenticated.next(true);
             this.authenticatedUser.next(response.data.user);
        this._toast.setSuccess(response.data);
        this._loading.hideLoading();
        this._router.navigate(['/login'])
      })
    )
  }
  
  saveAuthToLS(data: AuthResponse) {
    localStorage.setItem(this.AUDIT_APP_KEY, JSON.stringify(data))
  }

  loadAuthFromLS(): AuthResponse | null {
    let auth = localStorage.getItem(this.AUDIT_APP_KEY);
    if (auth) {
      return JSON.parse(auth);
    }
    return null;
  }

  autoLogin() {
    let auth = this.loadAuthFromLS();
    if (auth != null) {
      this.isAuthenticated.next(true);
      this.authenticatedUser.next(auth);
    }
  }

  logout() {
    this.authenticatedUser.next(null);
    this.isAuthenticated.next(false)
    localStorage.removeItem(this.AUDIT_APP_KEY);
    this._router.navigateByUrl("/")
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this._toast.setSuccess("Token expired, you're logged out")
    }, expirationDuration);
  }
}