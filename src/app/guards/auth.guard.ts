import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CustomComponent } from '../custom-component/custom-component.component';
import { Enterprise } from '../iterfaces/enterprise.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private customComponent: CustomComponent
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkAuth();
  }

  private async checkAuth() {
    const user = localStorage.getItem('user');
    const enterprise = localStorage.getItem('enterprise');
    if (
      user ||
      user !== 'undefined' ||
      enterprise ||
      enterprise !== 'undefined'
    ) {
      return true;
    } else {
      return true || this.routToLogin();
    }
  }

  private routToLogin() {
    this.navCtrl.navigateRoot('page/login');
    return true;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('records');
    localStorage.removeItem('token');
    localStorage.removeItem('enterprise');
    this.routToLogin();
  }

  async login(companyId: any, userId: string) {
    console.log(companyId);
    const req: any = this.http
      .post(
        `https://syspteste.herokuapp.com/api/login?companyId=${companyId}&userId=${userId}`,
        {
          responseType: 'json',
        }
      )
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.customComponent.presentAlert(
              'Atenção!',
              'Não foi possível realizar o login!',
              'Verifique suas credenciais',
              ['OK']
            );
            this.logout();
          }
          throw new Error('Não foi possível realizar o login');
        })
      );
    req.subscribe((res: any) => {
      if (res.user.userId === userId) {
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        if (res.user.userType === 'admin') {
          this.navCtrl.navigateRoot('page/mananger');
        } else {
          this.navCtrl.navigateRoot('page/tabs/register');
        }
      }
    });
  }

  /*
  async getEnterprise(companyId: string) {
    const req: any = this.http
      .post(
        `https://syspteste.herokuapp.com/api/login/loginEnterprise?companyId=${companyId}`,
        {
          responseType: 'json',
        }
      )
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.customComponent.presentAlert(
              'Atenção!',
              'Não foi possível realizar o login!',
              'Empresa não cadastrada',
              ['OK']
            );
            this.logout();
            throw new Error('Não foi possível realizar o login');
          }
          throw new Error('Não foi possível realizar o login');
        })
      );
    req.subscribe((res: any) => {
      console.log(res);
      if (res.enterprise.companyId === companyId) {
        localStorage.setItem('enterprise', JSON.stringify(res.enterprise));
      }
    });
  }*/

  getEnterprise(companyId: string): Observable<Enterprise> {
    return this.http
      .post<Enterprise>(
        `https://syspteste.herokuapp.com/api/login/loginEnterprise?companyId=${companyId}`,
        {
          responseType: 'json',
        }
      )
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            this.customComponent.presentAlert(
              'Atenção!',
              'Não foi possível realizar o login!',
              'Empresa não cadastrada',
              ['OK']
            );
            this.logout();
            throw new Error('Não foi possível realizar o login');
          }
          throw new Error('Não foi possível realizar o login');
        })
      );
  }
}
