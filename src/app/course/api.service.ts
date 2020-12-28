import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
const API = "https://api.classplusapp.com";

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getStore(data): Observable<any> {
    let paramsData = {
      'cacheKey': 'course_listing_filter_cache'
    }
    let params = new HttpParams();
    for (let param in paramsData) {
      params = params.set(param, paramsData[param].toString());
    }
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json')
    .set('X-Host-Override','api.classplusapp.com')
    .set('Api-Version','11');
    let options = {
      headers: httpHeaders,
      params: params
    }
    return this.http.post(API +'/cams/graph-api',data, options);
  }

  getCourseContent(id){
    let paramsData = {
      'courseId': id
    }
    let httpHeaders = new HttpHeaders();
    let params = new HttpParams();
    for (let param in paramsData) {
      params = params.set(param, paramsData[param].toString());
    }
    httpHeaders = httpHeaders.set('Content-Type', 'application/json')
    .set('X-Host-Override','api.classplusapp.com')
    .set('x-access-token',environment.token)
    .set('Api-Version','11');
    return this.http.get(API +'/v2/course/content/get', {
      headers: httpHeaders,
      params: params
    });
  }

  getCourseContentSub(courseId, folderId){
    let paramsData = {
      'courseId': courseId,
      'folderId': folderId
    }
    let httpHeaders = new HttpHeaders();
    let params = new HttpParams();
    for (let param in paramsData) {
      params = params.set(param, paramsData[param].toString());
    }
    httpHeaders = httpHeaders.set('Content-Type', 'application/json')
    .set('X-Host-Override','api.classplusapp.com')
    .set('x-access-token',environment.token)
    .set('Api-Version','11');
    return this.http.get(API +'/v2/course/content/get', {
      headers: httpHeaders,
      params: params
    });
  }

}