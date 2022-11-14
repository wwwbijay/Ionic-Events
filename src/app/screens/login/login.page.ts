import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/shared/models/IUser';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading: boolean = false;
  submitted: boolean = false;
  submitted_msg: string = '';
  error_msg!: string;
  login_error: any;

  constructor(
    private _menu: MenuController,
    private _router: Router, 
    private _auth: AuthService
    ) { 
    this._menu.enable(false);
  }

  ngOnInit(): void {
    
  }
  

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
   
    var login_model = {
      grantType: 'password',
      source: 'web application',
      userNameOrEmail: this.loginForm.value.username,
      password: this.loginForm.value.password,
      refreshToken: 'string',
    };

    if (!this.loginForm.invalid) {
      this.loading = true;
      this._auth.login(login_model).subscribe({
        next: (user: any) => {
          this.loading = false;
          console.log(user);
 
          let userProfile: IUser = {
            username: user.username,
            accessToken: user.accessToken,
            tokenType: user.tokenType,
            refreshToken: user.refreshToken,
            expiresIn: user.expiresIn,
            success: user.success,
            message: user.message,
            data: user.data,
            errors: user.errors,
          };

          this._auth.saveToLocalStorage(userProfile);
          this._router.navigate(['/events/home']);
        },
        error: (err: any) => {
          this.loading = false;
          this.submitted = true;
          console.log(err);
          // this.login_error = err?.error?.errors;

        }
      });

    }else{
      let invalidFields: any = [].slice.call(
        document.getElementsByClassName('ng-invalid')
      );
      invalidFields[1].focus();
    }
  }

}
