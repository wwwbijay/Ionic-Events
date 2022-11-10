import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  baseUrl = environment.baseUrl;
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plt: Platform,
    private router: Router
  ) {
    this.loadStoredToken();
  }

  GetAccessToken() {
    let user = this.loadStoredToken();
   // return user.accessToken;
  }

  // TO get refresh token while logging in with user name and password
  GetRefreshToken() {
    let user = this.loadStoredToken();
  //  return user.refreshToken;
  }

  // To generate the refresh token
  GenerateRefreshToken(token:any) {
    let input = {
      grantType: 'refresh_token',
      source: 'web',
      refreshToken: token,
    };
    return this.http.post(this.baseUrl + '/api/userauth/token', input);
  }

  handleRefreshToken() {
    let token = this.GetRefreshToken();
    this.GenerateRefreshToken(token).subscribe({
      next: (data: any) => {
        let user = this.loadStoredToken();
     //   user.accessToken = data.accessToken;
    //    user.refreshToken = data.refreshToken;
      //  this.saveToLocalStorage(user);
      },
      error: (err:any) => {
        console.log(err);
        this.logout();
      },
    });
  }

  loadStoredToken() {
    let platformObs = from(this.plt.ready());

    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map((token:any) => {
        if (token) {
          let decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  login(credentials: { email: string; pw: string }) {
    // Normally make a POST request to your APi with your login credentials
    if (
      credentials.email != 'saimon@devdactic.com' ||
      credentials.pw != '123'
    ) {
      return of(null);
    }

    return this.http.get('https://randomuser.me/api/').pipe(
      take(1),
      map((res) => {
        // Extract the JWT, here we just fake it
        return `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njc2NjU3MDYsImV4cCI6MTU5OTIwMTcwNiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiU2ltb24iLCJsYXN0X25hbWUiOiJHcmltbSIsImVtYWlsIjoic2FpbW9uQGRldmRhY3RpYy5jb20ifQ.4LZTaUxsX2oXpWN6nrSScFXeBNZVEyuPxcOkbbDVZ5U`;
      }),
      switchMap((token) => {
        let decoded = helper.decodeToken(token);
        this.userData.next(decoded);

        let storageObs = from(this.storage.set(TOKEN_KEY, token));
        return storageObs;
      })
    );
  }

  getUser() {
    return this.userData.getValue();
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }
}
