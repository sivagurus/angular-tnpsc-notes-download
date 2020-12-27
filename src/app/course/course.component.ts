import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  @ViewChild('courseList', {static: false}) courseList:ElementRef;

  constructor(
    private  apiService: ApiService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
     private renderer: Renderer2,
     private elementRef: ElementRef
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
      this.courses = res.data.items;
      this.cdRef.detectChanges()
    });
  }

  onCourseClick(course: any){
    let id = course.deeplink.paramOne;
    let element = this.courseList.nativeElement.querySelector(`[data-id="${id}"]`);
    this.renderer.removeClass(element, "closed");
    this.renderer.addClass(element, "opened");
    this.getCourseContent(id);
  }

  getCourseContent(id){
    this.apiService.getCourseContent(id).pipe(
      catchError((error) => {
        return throwError(error)
      })
    ).subscribe((res: any) => {
      let data = res.data.courseContent;
      this.addCourseContent(id, data);
      this.cdRef.detectChanges()
    });
  }

  addCourseContent(id, data: any[]){
    let element = this.courseList.nativeElement.querySelector(`[data-id="${id}"]`);
    let loaded = element.getAttribute('data-loaded');
    if( loaded == 'true' ){
      return
    }
    this.renderer.setAttribute(element, "data-loaded", "true");
    const ul = this.renderer.createElement('ul');
    data.forEach((item) => {
      let li = this.renderer.createElement('li');
      this.renderer.setAttribute(li, 'data-id', item.id);
      this.renderer.addClass(li,"closed");
      this.renderer.appendChild(li, document.createTextNode(item.name));
      this.renderer.listen(li, "click", (event) => {
       
      });
      this.renderer.appendChild(ul, li);
    });
    this.renderer.appendChild(element, ul);
  }


}