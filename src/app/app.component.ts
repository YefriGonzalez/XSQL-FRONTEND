import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from './services/api.service';
import { ObjetNav } from './iterfaces/objet-nav';
import { EditorComponent } from './components/editor/editor.component';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'XSQL';
  private apiService=inject(ApiService);
  arrayDB!:ObjetNav[];
  tabs:any;
  constructor(){
    this.tabs = [
      { label: 'query',content : EditorComponent},
    ];
  }
 
  ngOnInit(): void {
    this.apiService.getAll("getJsonDatabases").subscribe((res)=>{
      this.arrayDB=res
    })
  }
  newQuery(){
    this.tabs.push({label:'query',content: EditorComponent})
  }
}
