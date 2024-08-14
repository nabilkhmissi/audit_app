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
import { MessageService } from "primeng/api";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authServ: AuthService,
    private _toast : ToastService,
    private _message : MessageService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      
      //complete if 403 or 401 redirect to login and logout

      // tap((res : any) => {
      //   if(res.status == 200 || res.status == 201){
      //     this._message.add({severity:'success', summary: 'Success', detail: res.body.message})
      //   }
      // }), 
      catchError((err) => {
        if (err.status === 401) {
          this.authServ.logout();
        }
        this._message.add({severity:'error', summary: 'Error', detail: err.error.message})
        return of(err);
      })
    );
  }
}