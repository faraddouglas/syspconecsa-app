import { lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TestApiService {
  getUrl = 'https://syspteste.herokuapp.com/api/test-api';

  constructor(private http: HttpClient) {}

  async testApi() {
    const response = await lastValueFrom(
      this.http.get(this.getUrl, { responseType: 'text' })
    );
    console.log(response);
  }
}
