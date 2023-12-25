import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  viewEditor=false;
  private apiService = inject(ApiService);
  messagesError: string[] = [];
  messagesOK: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [];
  executeQuery(text: string) {
    if (text) {
      this.viewEditor=false
      this.apiService.post('compile', { text }).subscribe({
        next: (res) => {
          this.messagesError = res.error;
          this.messagesOK = res.ok;
          this.dataSource =new  MatTableDataSource(res.json || []);
          if (res.json){
            this.viewEditor=true
            this.displayedColumns = Object.keys(res.json[0]);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
}
