import { Component, ElementRef, Renderer, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: [ './video.component.css' ]
})
export class VideoComponent  {
  url = "";
  result = "";
  @ViewChild('input', {static: true}) input: ElementRef;

  constructor(
    private _snackBar: MatSnackBar,
    private renderer: Renderer
  ) {}

  onChange(){
    let temp = this.url.replace("thumbs","manifests")
    .replace(/(-\d*.*)/g,".m3u8");
    this.result = temp;
  }

  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this._snackBar.open("Copied", '', {
      duration: 200,
      verticalPosition: "top"
    });
    this.url = this.result = "";
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
  }
}