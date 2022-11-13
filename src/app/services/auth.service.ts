import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/IUser';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private mystorage: Storage | null = null;

  userProfile: BehaviorSubject<IUser> = new BehaviorSubject<IUser>({
    username: '',
    accessToken: '',
    tokenType: '',
    refreshToken: '',
    expiresIn: '',
    success: '',
    message: '',
    data: '',
    errors: '',
  });

  baseUrl: string = environment.baseUrl;
  jwthelper = new JwtHelperService();
  tokenExpired: Boolean = false;
 
  constructor(
    private _http: HttpClient, 
    private _router: Router,
    private _plt: Platform,
    private _storage: Storage
  ) { 
    this.ngOnInit();
  }

  async ngOnInit() {
    const storage = await this._storage.create();
    this.mystorage = storage;
  }

  login(model: any): Observable<any> {
    return this._http.post(this.baseUrl + '/api/userauth/token', model);
  }

  async isLoggedIn() {
    const user = await this.loadFromLocalStorage();
    return !this.jwthelper.isTokenExpired(user.accessToken);
  }
  

  async GetAccessToken() {
    let user = await this.loadFromLocalStorage();
    return user.accessToken;
  }

  // TO get refresh token while logging in with user name and password
  async GetRefreshToken() {
    let user = await this.loadFromLocalStorage();
    return user.refreshToken;
  }

  // To generate the refresh token
  GenerateRefreshToken(token:any) {
    let input = {
      grantType: 'refresh_token',
      source: 'web',
      refreshToken: token,
    };
    return this._http.post(this.baseUrl + '/api/userauth/token', input);
  }

  handleRefreshToken() {
    let token = this.GetRefreshToken();
    this.GenerateRefreshToken(token).subscribe({
      next: async (data: any) => {
        let user = await this.loadFromLocalStorage();
        user.accessToken = data.accessToken;
        user.refreshToken = data.refreshToken;
        this.saveToLocalStorage(await user);
      },
      error: (err:any) => {
        console.log(err);
        this.logout();
      },
    });
  }

  async saveToLocalStorage(user: IUser) {
   
    this.userProfile.next(user);
    await this._storage.set('प्रशासकप्रोफाइल', JSON.stringify(user));
  }

  async loadFromLocalStorage(): Promise<IUser> {
    if (!this.userProfile.value.accessToken) {
      let fromStorage = this._storage.get('प्रशासकप्रोफाइल');
      
      if (!!fromStorage) {
       
        let userInfo = JSON.parse(await fromStorage);
        this.userProfile.next(userInfo);
      }
    }
    return this.userProfile.value;
  }

  async logout() {
   
    await this._storage.remove('प्रशासकप्रोफाइल');

    this.userProfile.next({
      username: '',
      accessToken: '',
      tokenType: '',
      refreshToken: '',
      expiresIn: '',
      success: '',
      message: '',
      data: '',
      errors: '',
    });
    this._router.navigate(['']);

  }
}
