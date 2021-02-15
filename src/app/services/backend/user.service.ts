import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  private baseUrl: string = environment.baseUrl;
}
