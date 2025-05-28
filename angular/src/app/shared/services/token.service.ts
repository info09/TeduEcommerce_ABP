import { Injectable } from '@angular/core';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/key.const';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  signOut() {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(ACCESS_TOKEN);
    window.sessionStorage.setItem(ACCESS_TOKEN, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(ACCESS_TOKEN);
  }

  public saveRefreshToken(refreshToken: string): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN);
    window.sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESH_TOKEN);
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
