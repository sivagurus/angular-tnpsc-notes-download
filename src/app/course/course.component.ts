import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import * as _ from "lodash";
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  encapsulation: ViewEncapsulation.None
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
    this.apiService.getStore().pipe(
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
          this.renderer.setAttribute(li, 'data-folderId', item.id);
        } else if(item.contentType == 2){
          type = "video";
        } else if(item.contentType == 3){
          type = "pdf";
        } else if(item.contentType == 4){
          type = "test";
          this.renderer.setAttribute(li, 'data-testId', item.testId);
        } else{
          type = "others"
        }
      this.renderer.setAttribute(li, 'data-contentType', type);
      this.renderer.setAttribute(li, 'data-courseId', id);
      this.renderer.setAttribute(li, 'data-id', item.id);
      this.renderer.setAttribute(li, 'data-name', item.name);
      this.renderer.addClass(li,"closed");
      let liText = document.createTextNode(item.name);
      if( type == "pdf" ){
        let a = document.createElement('a');
        let linkText = document.createTextNode(item.name);
        a.appendChild(linkText);
        a.title = item.name;
        a.href = item.url;
        a.target = "_blank";
        this.renderer.addClass(a,"pdfLink");
        this.renderer.appendChild(li, a);
      } else{
        this.renderer.appendChild(li, liText);
      }
      if( type == "folder" ){
        let button = document.createElement("button");
        this.renderer.addClass(button,"copyFolderBtn");
        button.innerHTML = "Copy Videos";
        this.renderer.listen(button, "click", (event) => {
          let videosElem = this.elementRef.nativeElement.querySelectorAll(`[data-folderId='${item.id}'] [data-contentType='video']`);
          let string = "";
          for (var i in videosElem) {
            if (videosElem.hasOwnProperty(i)) {
              let videoUrl = '`'+videosElem[i].getAttribute('data-youtube_dl')+'`'+ "\n";
              string = string + videoUrl;
            }
          }
          this.copy(string);
        });
        this.renderer.appendChild(li, button);
      }
      this.renderer.listen(li, "click", (event) => {
        event.stopImmediatePropagation();
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
      let parentElement = li;
      this.renderer.setAttribute(element, "data-loaded", "true");
      const ul = this.renderer.createElement('ul');
      data.forEach((item) => {
        let li = this.renderer.createElement('li');
        let type = '';
        let liText = document.createTextNode(item.name);
        if(item.contentType == 1){
          type = "folder";
          this.renderer.setAttribute(li, 'data-folderId', item.id);
        } else if(item.contentType == 2){
          type = "video";
        } else if(item.contentType == 3){
          type = "pdf";
        } else if(item.contentType == 4){
          type = "test";
          this.renderer.setAttribute(li, 'data-testId', item.testId);
        } else{
          type = "others"
        }
        if( type == "pdf" ){
          let a = document.createElement('a');
          let linkText = document.createTextNode(item.name);
          a.appendChild(linkText);
          a.title = item.name;
          a.href = item.url;
          a.target = "_blank";
          this.renderer.addClass(a,"pdfLink");
          this.renderer.appendChild(li, a);
        } else{
          this.renderer.appendChild(li, liText);
        }
        if( type == "folder" ){
          let button = document.createElement("button");
          this.renderer.addClass(button,"copyFolderBtn");
          button.innerHTML = "Copy Videos";
          this.renderer.listen(button, "click", (event) => {
            let videosElem = this.elementRef.nativeElement.querySelectorAll(`[data-folderId='${item.id}'] [data-contentType='video']`);
            let string = "";
            for (var i in videosElem) {
              if (videosElem.hasOwnProperty(i)) {
                let videoUrl = '`'+videosElem[i].getAttribute('data-youtube_dl')+ '`' + "\n";
                string = string + videoUrl;
              }
            }
            this.copy(string);
          });
          this.renderer.appendChild(li, button);
        }
        this.renderer.setAttribute(li, 'data-contentType', type);
        this.renderer.setAttribute(li, 'data-courseId', courseId);
        this.renderer.setAttribute(li, 'data-id', item.id);
        this.renderer.setAttribute(li, 'data-name', item.name);
        this.renderer.addClass(li,"closed");
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
            let path = this.getPath(courseId, item);
            this.copyToClipboard(item.url, path);
          }
        });
        this.renderer.appendChild(ul, li);
        if( type == "video" ){
          let path = this.getPathName(courseId, item, parentElement);
          this.renderer.setAttribute(li, 'data-youtube_dl', `youtube-dl -o "${path}.%(ext)s" ${item.url} >/dev/null 2>&1`);
        }
      });
      this.renderer.appendChild(element, ul);
      this.cdRef.detectChanges();
    });
  }

  getPath(courseId, item){
    let path = [];
    let find = this.elementRef.nativeElement.querySelector(`li[data-courseId="${courseId}"][data-id="${item.id}"]`);
    let parent = 'false';
    while(parent != 'true'){
      let dataParent = find.getAttribute('data-parent');
      parent = (dataParent)? dataParent: 'false';
      find = find.parentElement;
      if( find.nodeName == 'LI' ){
          let name = find.getAttribute('data-name');
          if(name){
            path.push(name);
          }
      }
    }
    path.reverse();
    path.push(item.name);
    return './'+path.join("/");
  }

  getPathName(courseId, item, element){
    let path = [];
    let find = element;
    let parent = 'false';
    while(parent != 'true'){
      let dataParent = find.getAttribute('data-parent');
      parent = (dataParent)? dataParent: 'false';
      find = find.parentElement;
      if( find.nodeName == 'LI' ){
          let name = find.getAttribute('data-name');
          if(name){
            path.push(name);
          }
      }
    }
    path.reverse();
    path.push(element.getAttribute('data-name'));
    path.push(item.name);
    return './'+path.join("/");
  }

  copyToClipboard(url, name) {
    let command = `youtube-dl -o "${name}.%(ext)s" ${url} >/dev/null 2>&1
    `;
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

  copy(content) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (content));
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