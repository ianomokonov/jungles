import { refreshTokenKey, userTokenKey } from 'src/app/constants';

export class TokenService {
  public getRefreshToken() {
    return localStorage.getItem(refreshTokenKey);
  }

  public getAuthToken() {
    return localStorage.getItem(userTokenKey);
  }

  public storeTokens(tokens: string[]) {
    localStorage.setItem(userTokenKey, tokens[0]);
    localStorage.setItem(refreshTokenKey, tokens[1]);
  }

  public removeTokens() {
    localStorage.removeItem(userTokenKey);
    localStorage.removeItem(refreshTokenKey);
  }
}
