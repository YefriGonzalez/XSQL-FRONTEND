import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { ApiService } from './services/api.service';
import { ObjetNav } from './iterfaces/objet-nav';
import { EditorComponent } from './components/editor/editor.component';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChildren('editors') editors!: QueryList<EditorComponent>;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  title = 'XSQL';
  selectedItem: any;
  private apiService = inject(ApiService);
  arrayDB!: ObjetNav[];
  tabs: any;
  constructor() {
    this.tabs = [{ label: 'query', content: EditorComponent }];
  }

  ngOnInit(): void {
    this.chargeJson();
  }
  chargeJson() {
    this.apiService.getAll('getJsonDatabases').subscribe((res) => {
      this.arrayDB = res;
    });
  }
  newQuery() {
    this.tabs.push({ label: 'query', content: EditorComponent });
  }
  generateFile(index: any): void {
    const selectedEditor = this.editors.toArray()[index];
    if (selectedEditor) {
      console.log('sELETECT');
      selectedEditor.createFile();
    }
  }

  generateDump(event: any) {
    this.apiService.getAll(`generateDump?db=${event}`).subscribe((res) => {
      const blob = new Blob([res.data], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `${event}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
    console.log(event);
  }
  recargarPeticion() {
    this.chargeJson();
  }

  viewFile(type: number) {
    switch (type) {
      case 1:
        window.open(
          `http://127.0.0.1:8000/static/Manual Tecnico.pdf`,
          '_blank'
        );
        break;
      case 2:
        window.open(
          `http://127.0.0.1:8000/static/Manual de Usuario.pdf`,
          '_blank'
        );
        break;
      case 3:
        window.open(
          `http://127.0.0.1:8000/static/Gramaticas.txt`,
          '_blank'
        );
        break;
    }
  }
}
