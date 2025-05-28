import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequestDto } from '../model/login-request.dto';
import { Observable } from 'rxjs';
import { LoginResponseDto } from '../model/login-response.dto';
import { environment } from 'src/environments/environment';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/key.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  public login(input: LoginRequestDto): Observable<LoginResponseDto> {
    var body = {
      username: input.username,
      password: input.password,
      client_id: environment.oAuthConfig.clientId,
      grant_type: 'password',
      scope: environment.oAuthConfig.scope,
    };
    const data = Object.keys(body)
      .map((key, index) => `${key}=${encodeURIComponent(body[key])}`)
      .join('&');
    return this.http.post<LoginResponseDto>(
      `${environment.oAuthConfig.issuer}connect/token`,
      data,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  }

  public refreshToken(refresh_token: string): Observable<LoginResponseDto> {
    var body = {
      client_id: environment.oAuthConfig.clientId,
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    };

    const data = Object.keys(body)
      .map((key, index) => `${key}=${encodeURIComponent(body[key])}`)
      .join('&');
    return this.http.post<LoginResponseDto>(
      environment.oAuthConfig.issuer + 'connect/token',
      data,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem(ACCESS_TOKEN) != null;
  }

  public logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }
}
