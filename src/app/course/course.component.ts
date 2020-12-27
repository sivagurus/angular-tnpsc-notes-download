import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import * as _ from "lodash";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  token = "";
  courses: any[] = [];

  constructor(
    private  apiService: ApiService
  ) { }

  ngOnInit() {
    this.getStore();
  }

  getStore(){
    this.apiService.getStore(this.token).pipe(
      catchError((error) => {
        return throwError(error)
      })
    ).subscribe((res: any) => {
      this.courses = res.items;
    });
  }

}