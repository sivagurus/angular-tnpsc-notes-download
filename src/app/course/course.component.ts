import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, Renderer2, ViewChild } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import * as _ from "lodash";
import { HttpClient } from '@angular/common/http';
import * as storeQuery from './storeQuery.json';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;

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
    private elementRef: ElementRef,
    private _snackBar: MatSnackBar,
  ) {
    
  }

  ngOnInit() {
    this.getStore();
    $(document).on("click",'li',function(){
      console.log("jquery");
    });
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
      let type = '';
        if(item.contentType == 1){
          type = "folder";
        } else if(item.contentType == 2){
          type = "video";
        } else{
          type = "others"
        }
      this.renderer.setAttribute(li, 'data-contentType', type);
      this.renderer.setAttribute(li, 'data-courseId', id);
      this.renderer.setAttribute(li, 'data-folderId', item.id);
      this.renderer.addClass(li,"closed");
      this.renderer.appendChild(li, document.createTextNode(item.name));
      this.renderer.listen(li, "click", (event) => {
        this.renderer.removeClass(li, "closed");
        this.renderer.addClass(li, "opened");
        let newLi = this.elementRef.nativeElement.querySelector(`li[data-courseId="${id}"][data-folderId="${item.id}"]`);
        let loaded = newLi.getAttribute('data-loaded');
        if( loaded == 'true' || type != "folder"){
          return
        }
        this.addSubContents(li, id, item.id);
      });
      this.renderer.appendChild(ul, li);
    });
    this.renderer.appendChild(element, ul);
  }

  addSubContents(li, courseId, folderId){
    this.apiService.getCourseContentSub(courseId, folderId).pipe(
      catchError((error) => {
        return throwError(error)
      })
    ).subscribe((res: any) => {
      let data = res.data.courseContent;
      let element = li;
      this.renderer.setAttribute(element, "data-loaded", "true");
      const ul = this.renderer.createElement('ul');
      data.forEach((item) => {
        let li = this.renderer.createElement('li');
        let type = '';
        if(item.contentType == 1){
          type = "folder";
        } else if(item.contentType == 2){
          type = "video";
        } else{
          type = "others"
        }
        this.renderer.setAttribute(li, 'data-contentType', type);
        this.renderer.setAttribute(li, 'data-courseId', courseId);
        if( type == "folder" ){
          this.renderer.setAttribute(li, 'data-folderId', item.id);
        }
        this.renderer.addClass(li,"closed");
        this.renderer.appendChild(li, document.createTextNode(item.name));
        this.renderer.listen(li, "click", (event) => {
          event.stopImmediatePropagation();
          this.renderer.removeClass(li, "closed");
          this.renderer.addClass(li, "opened");
          if( type == "folder" ){
            let newLi = this.elementRef.nativeElement.querySelector(`li[data-courseId="${courseId}"][data-folderId="${item.id}"]`);
            let loaded = newLi.getAttribute('data-loaded');
            if( loaded == 'true' ){
              return
            }
            this.addSubContents(li, courseId, item.id);
          } else if( type == "video"){
            this.copyToClipboard(item.url, item.name);
          }
        });
        this.renderer.appendChild(ul, li);
      });
      this.renderer.appendChild(element, ul);
      this.cdRef.detectChanges()
    });
  }

  copyToClipboard(url, name) {
    let command = `youtube-dl -o "%${name}.%(ext)s" ${url}`;
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (command));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this._snackBar.open("Link Copied", '', {
      duration: 200,
      verticalPosition: "top"
    });
  }

  
}