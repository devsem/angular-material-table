import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from './user';

@Injectable()
export class UserService {

  private url = 'https://apialex.azurewebsites.net';
  // private url = 'http://localhost:51120';
  constructor(private http: HttpClient) { }

  getUsers() {
    const getUrl = this.url + '/api/all/';
    return this.http.get(getUrl);
  }

  createUser(user: User) {
    const saveUrl = this.url + '/api/Users';
    return this.http.post(saveUrl, user);
  }
  updateUser(id: number, user: User) {
    const urlParams = new HttpParams().set('id', id.toString());
    return this.http.post(this.url + '/api/update', user);
  }
  deleteUser(id: number) {
    const urlParams = new HttpParams().set('id', id.toString());
    return this.http.delete(this.url + '/api/delete/' + id);
  }
}
