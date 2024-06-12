import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";


export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return next.handle(req).pipe(
            catchError((response: HttpErrorResponse) => {
                let message = "hata oluştu.";

                if(response.error.error) {
                    if(response.status === 401) {
                        message = "Yetkiniz yok.";
                        console.log(message);
                        return throwError(message);
                    }
                }

                if(response.error.error) {
                    switch(response.error.error.message) {
                      case "EMAIL_EXISTS":
                        message = "Bu e-posta adresi zaten kayıtlı";
                        break;
                      case "EMAIL_NOT_FOUND":
                        message = "Böyle bir e-posta adresi bulunamadı";
                        break;
                      case "INVALID_PASSWORD":
                        message = "Şifre hatalı";
                        break;
                      default:
                        message = "Bilinmeyen bir hata oluştu";
                        break;
                    }
                  }

                return throwError(message);
            })
        )

    }

}