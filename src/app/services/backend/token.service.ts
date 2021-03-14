import { refreshTokenKey, userTokenKey } from 'src/app/constants';

export class TokenService {
  public getRefreshToken() {
    return sessionStorage.getItem(refreshTokenKey);
  }

  public getAuthToken() {
    return sessionStorage.getItem(userTokenKey);
  }

  public storeTokens(tokens: string[]) {
    sessionStorage.setItem(userTokenKey, tokens[0]);
    sessionStorage.setItem(refreshTokenKey, tokens[1]);
  }

  public removeTokens() {
    sessionStorage.removeItem(userTokenKey);
    sessionStorage.removeItem(refreshTokenKey);
  }
}
