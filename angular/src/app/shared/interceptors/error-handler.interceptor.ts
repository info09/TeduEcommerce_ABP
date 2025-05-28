import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(ex => {
        if (ex.status == 500) {
          this.notificationService.showError('Hệ thống có lôi xảy ra. Vui lòng liên hệ admin');
        }
        throw ex;
      })
    );
  }
}
