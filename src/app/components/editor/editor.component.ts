import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit {
  editorOptions = {};
  @Output() senalAlPadre = new EventEmitter<void>();
  ngOnInit(): void {
    this.editorOptions = { theme: 'vs-dark', language: 'sql' };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  viewEditor = false;
  private apiService = inject(ApiService);
  messagesError: string[] = [];
  messagesOK: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [];

  constructor() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  code: string = '';

  executeQuery() {
    if (this.code) {
      this.viewEditor = false;
      let maxIndex = -1; // Variable para almacenar el índice del elemento con el valor más grande
      let maxValue = Number.MIN_VALUE;
      this.messagesError = [];
      this.messagesOK = [];
      this.dataSource = new MatTableDataSource();
      this.apiService.post('compile', { text: this.code }).subscribe({
        next: (res) => {
          this.messagesError = res.error;
          this.messagesOK = res.ok;
          if (res.json.length > 0) {
            let data = res.json;
            for (let i = 0; i < data.length; i++) {
              const currentItem = data[i];
              const keys = Object.keys(currentItem);
              keys.forEach((key) => {
                const value = parseFloat(currentItem[key]);
                if (!isNaN(value) && value > maxValue) {
                  maxValue = value;
                  maxIndex = i;
                }
              });
            }
            this.dataSource = new MatTableDataSource(res.json || []);
            this.viewEditor = true;
            this.displayedColumns = Object.keys(res.json[maxIndex]);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
           
           
          }
          if (res.ok.length>0){
            window.open(
              `http://127.0.0.1:8000/static/${res.nameAst}`,
              '_blank'
            );
            this.senalAlPadre.emit()
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createFile() {
    const data: any[] = this.dataSource.data;
    if (data.length > 0) {
      const date = new Date().toISOString();
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

      XLSX.writeFile(workbook, `export-${date}.xlsx`);
    }
  }
}
