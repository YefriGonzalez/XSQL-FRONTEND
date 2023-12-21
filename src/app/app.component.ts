import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from './services/api.service';
import { ObjetNav } from './iterfaces/objet-nav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'XSQL';
  private apiService=inject(ApiService);
  arrayDB!:ObjetNav[];
  tabs = [
    { label: 'query', content: 'Content 1' },
  ];
  ngOnInit(): void {
    this.apiService.getAll("getJsonDatabases").subscribe((res)=>{
      this.arrayDB=res
    })
  }
}
