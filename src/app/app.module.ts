import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import {MatTreeModule} from '@angular/material/tree';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { ApiService } from './course/api.service';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: "",
    redirectTo: "course",
    pathMatch: "full"
  },
  { 
    path: 'course', 
    component: CourseComponent 
  },
];

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatTreeModule,
    MatProgressBarModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [ 
    AppComponent,
    CourseComponent
  ],
  bootstrap:    [ AppComponent ],
  providers: [ApiService]
})
export class AppModule { }
