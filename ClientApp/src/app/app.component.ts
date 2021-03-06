
import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';

import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { HttpClient } from '@angular/common/http';

export interface UsersData {
  name: string;
  id: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  displayedColumns: string[] = ['name', 'age', 'designation', 'mobileNumber', 'action'];
  dataSource: any;
  public employeelist: EmployeeList;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(public dialog: MatDialog, public http: HttpClient, @Inject('BASE_URL') public baseUrl: string) {
    http.get<EmployeeList[]>(baseUrl + 'api/EmployeeList').subscribe(result => {
      this.dataSource = result;
    }, error => console.error(error));
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '300px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addRowData(result.data);
      } else if (result.event == 'Update') {
        this.updateRowData(result.data);
      } else if (result.event == 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(newRow) {
    this.dataSource.push({
      name: newRow.name,
      age: newRow.age,
      designation: newRow.designation,
      mobileNumber: newRow.mobileNumber
    });

    this.employeelist = {
      id:newRow.id,
      name: newRow.name,
      age: parseInt(newRow.age),
      designation: newRow.designation,
      mobileNumber: parseInt(newRow.mobileNumber)
    };
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(this.employeelist);
    this.http.post<EmployeeList>(this.baseUrl + 'api/EmployeeList', body, { 'headers': headers }).subscribe(data => {
    })

    this.table.renderRows();

  }
  updateRowData(newRow) {
    this.dataSource = this.dataSource.filter((value, key) => {
      if (value.id == newRow.id) {
        value.name = newRow.name;
        value.age = newRow.age;
        value.designation = newRow.designation;
        value.mobileNumber = newRow.mobileNumber;
      }

      this.employeelist = {
        id: newRow.id,
        name: newRow.name,
        age: parseInt(newRow.age),
        designation: newRow.designation,
        mobileNumber: parseInt(newRow.mobileNumber)
      };
      const headers = { 'content-type': 'application/json' }
      const body = JSON.stringify(this.employeelist);
      this.http.put<EmployeeList[]>(this.baseUrl + 'api/EmployeeList/' + newRow.id, body, { 'headers': headers }).subscribe(data => {
      })
      return true;
    });
  }
  deleteRowData(newRow) {
    this.dataSource = this.dataSource.filter((value, key) => {
      this.http.delete<any>(this.baseUrl + 'api/EmployeeList/' + newRow.id).subscribe(data => {
      })
      return value.id != newRow.id;
    });
  }
}


interface EmployeeList {
  id: number;
  name: string;
  age: number;
  designation: string;
  mobileNumber: number;
}
