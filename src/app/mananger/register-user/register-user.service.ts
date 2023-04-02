import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, catchError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CustomComponent } from 'src/app/custom-component/custom-component.component';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class RegisterUserService {
    urluser = 'https://syspteste.herokuapp.com/api/users';

    constructor(
        private http: HttpClient,
        private customComponent: CustomComponent,
        private router: Router
    ) { }

    async postUser(user: object) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Conection': 'keep-alive',
            'Accept': '*/*'
        });
        const req: any = this.http.post<any>(this.urluser, user,
            { headers: headers }).pipe(
                catchError((err) => {
                    if (err.status == 500) {
                        this.customComponent.presentAlert(
                            'Erro',
                            'Falha ao cadastrar o usuário',
                            'Verifique se todos os campos foram preenchidos corretamente',
                            ['Ok']
                        );
                        return err;
                    } else if (err.status == 400 || 401) {
                        this.customComponent.presentAlert(
                            'Erro',
                            'Falha ao cadastrar o usuário',
                            'Refaça o login e tente novamente',
                            ['Ok']
                        );
                        this.router.navigate(['page/login']);
                        return err;
                    }
                })
            );
        return lastValueFrom(req);
    }
}