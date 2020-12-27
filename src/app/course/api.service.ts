import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
const API = "https://api.classplusapp.com";

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getStore(){
    let paramsData = {
      'cacheKey': 'course_listing_filter_cache'
    }
    let httpHeaders = new HttpHeaders();
    let params = new HttpParams();
    for (let param in paramsData) {
      params = params.set(param, paramsData[param].toString());
    }
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.get(API +'/cams/graph-api', {
      headers: httpHeaders,
      params: params
    });
  }

}