import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) {
  }

  getAll(path: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`);
  }

  post(path: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${path}`, data);
  }

  delete(path: string, id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${path}/${id}`);
  }

  patch(path: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}${path}`, data);
  }
}