import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import * as _ from "lodash";
import { HttpClient } from '@angular/common/http';
import * as storeQuery from './storeQuery.json';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  token = "";
  courses: any[] = [];

  constructor(
    private  apiService: ApiService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getStore();
  }

  getStore(){
    let query = storeQuery;
    this.apiService.getStore(query).pipe(
      catchError((error) => {
        return throwError(error)
      })
    ).subscribe((res: any) => {
      this.courses = res.items;
    });
  }

}