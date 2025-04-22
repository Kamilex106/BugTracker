import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private oktaAuth: OktaAuth) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('Intercepting request to:', request.url);

    return from(this.oktaAuth.isAuthenticated()).pipe(
      mergeMap((isAuthenticated: boolean) => {
        // console.log('User is authenticated:', isAuthenticated);

        if (!isAuthenticated) {
          return next.handle(request);
        }

        return from(Promise.resolve().then(async () => {
          try {
            const token = await this.oktaAuth.getAccessToken() || '';
            // console.log('Access token retrieved:', token ? '[token present]' : '[empty]');
            return token;
          } catch (error) {
            // console.error('Error while retrieving access token:', error);
            return '';
          }
        })).pipe(
          mergeMap((token: string) => {
            if (token) {
              // console.log('Adding Authorization header');
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
            } else {
              console.warn('No token found, proceeding without Authorization header');
            }

            return next.handle(request);
          })
        );
      })
    );
  }
}
