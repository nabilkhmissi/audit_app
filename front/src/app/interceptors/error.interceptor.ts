import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ToastService } from "../services/toast.service";
import { AuthService } from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authServ: AuthService,
    private _toast : ToastService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((res : any) => {
        if(res.status == 200 || res.status == 201){
          this._toast.setSuccess(res.body.message);
        }
      }), 
      catchError((err) => {
        if (err.status === 401) {
          this.authServ.logout();
        }
        this._toast.setError(err.error.message);
        return of(err);
      })
    );
  }
}