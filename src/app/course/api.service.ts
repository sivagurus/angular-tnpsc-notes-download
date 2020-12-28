import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const API = "https://magnetic-spotted-skink.glitch.me";

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getStore(): Observable<any> {
    return this.http.get(API +'/getStore');
  }

  getCourseContent(id){
    let paramsData = {
      'courseId': id
    }
    let params = new HttpParams();
    for (let param in paramsData) {
      params = params.set(param, paramsData[param].toString());
    }
    return this.http.get(API +'/getContent', {
      params: params
    });
  }

  getCourseContentSub(courseId, folderId){
    let paramsData = {
      'courseId': courseId,
      'folderId': folderId
    }
    let params = new HttpParams();
    for (let param in paramsData) {
      params = params.set(param, paramsData[param].toString());
    }
    return this.http.get(API +'/getContentSub', {
      params: params
    });
  }

}