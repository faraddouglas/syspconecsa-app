import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, catchError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CustomComponent } from 'src/app/custom-component/custom-component.component';
import { Router } from '@angular/router';

@Injectable({
providedIn: 'root'
})

export class RegisterEnterpriseService {
  urlEnterprises: string = 'https://syspteste.herokuapp.com/api/enterprises';

  constructor(
    private http: HttpClient,
    private customComponent: CustomComponent,
    private router: Router
    ) {}

  async getEnterprise() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Conection': 'keep-alive',
      'Accept': '*/*'
    });
    return lastValueFrom( this.http.get<any>(this.urlEnterprises, { headers: headers }))
  }

  async postEnterprise(enterprise: object) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Conection': 'keep-alive',
      'Accept': '*/*'
    });
    const req: any = this.http.post<any>(this.urlEnterprises, enterprise,
      { headers: headers }).pipe(
        catchError((err) => {
          if ( err.status == 500) {
            this.customComponent.presentAlert(
              'Erro',
              'Falha ao cadastrar a empresa',
              'Verifique se todos os campos foram preenchidos corretamente',
              ['Ok']
            );
            return err;
          } else if (err.status == 400 || 401){
            this.customComponent.presentAlert(
              'Erro',
              'Falha ao cadastrar a empresa',
              'Refaça o login e tente novamente',
              ['Ok']
            );
            this.router.navigate(['page/login']);
            return err;
          }
        })
      );
      req.subscribe((res: any) => {
        if (res.companyId != null) {
          this.customComponent.presentAlert(
            'Sucesso',
            'A empresa foi cadastrada',
            'Agora você pode cadastrar os usuários',
            ['Ok']
          );
          this.router.navigate(['page/mananger/register-user']);
        }
      }
    );
  }
}
