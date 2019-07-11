import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';
import {
  MatSort,
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatSnackBar,
} from '@angular/material';
import { DialogOverviewExampleDialogComponent } from './dialog-overview-example-dialog/dialog-overview-example-dialog.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  addNewUser: User[] = [
    { Id: 0, Name: null, Age: null, Email: null, Surname: null, IsEdit: false, Icon: 'edit' }
  ];

  users: Array<User>;
  showTable: boolean;
  statusMessage: string;
  isLoaded = true;
  displayedColumnsUsers: string[] = ['Id', 'Name', 'Surname', 'Age', 'Email', 'Action'];
  displayedColumnsAddUser: string[] = ['Name', 'Surname', 'Age', 'Email', 'Save', 'Cancel'];
  dataSourceUsers: any;
  dataSourceAddUser: any;
  newUser: User;
  name;
  age;
  email;
  surnameFormControl;
  constructor(private serv: UserService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.users = new Array<User>();
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.loadUsers();
    this.dataSourceAddUser = new MatTableDataSource();
    this.name = new FormControl('', [Validators.required]);
    this.age = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.surnameFormControl = new FormControl('', [Validators.required]);
  }

  applyFilter(filterValue: string) {
    this.dataSourceUsers.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceUsers.paginator) {
      this.dataSourceUsers.paginator.firstPage();
    }
  }

  private loadUsers() {
    this.isLoaded = true;
    this.serv.getUsers().subscribe((data: User[]) => {
      this.users = data;
      this.users.sort(function (obj1, obj2) {
        return obj2.Id - obj1.Id;
      });

      this.users.map(u => {
        u.IsEdit = false;
        u.Icon = 'edit';
      });
      this.isLoaded = false;
      this.dataSourceUsers = new MatTableDataSource(this.users);
      this.dataSourceAddUser = new MatTableDataSource(this.addNewUser);
      this.dataSourceUsers.sort = this.sort;
      this.dataSourceUsers.paginator = this.paginator;
      console.log(this.dataSourceUsers);
    }, (error) => {
      alert('Error: ' + error.name);
      this.isLoaded = false;
    });
  }

  deleteUserForDialog(user: User) {
    this.serv.deleteUser(user.Id).subscribe(data => {
      this.statusMessage = 'User ' + user.Name + ' is deleted',
        this.openSnackBar(this.statusMessage, 'Success');
      this.loadUsers();
    });
  }

  editUser(user: User) {
    if (!user.IsEdit) {
      user.IsEdit = true;
      user.Icon = 'save';
    } else {
      this.updateUser(user);
    }
  }

  updateUser(user: User) {
    this.serv.updateUser(user.Id, user).subscribe(data => {
      this.statusMessage = 'User ' + user.Name + ' is updated',
        this.openSnackBar(this.statusMessage, 'Success');
      user.IsEdit = !user.IsEdit;
      user.Icon = 'edit';
      this.loadUsers();
    }, (error) => {
      this.openSnackBar(error.statusText, 'Error');
    });
  }

  cancelEdit(user: User) {
    user.IsEdit = !user.IsEdit;
    user.Icon = 'edit';
  }

  saveUser(user: User) {
    if (user.Age !== null && user.Name !== null && user.Name !== '' && user.Age !== 0) {
      this.serv.createUser(user).subscribe(data => {
        this.statusMessage = 'User ' + user.Name + ' is added',
          this.showTable = false;
        this.openSnackBar(this.statusMessage, 'Success');
        this.loadUsers();
      }, (error) => {
        this.showTable = false;
        this.openSnackBar(error.statusText, 'Error');
      }
      );
    } else {
      this.openSnackBar('Please enter correct data', 'Error');
    }
  }

  show() {
    this.showTable = true;
    this.addNewUser = [{ Id: 0, Name: null, Age: null, Email: null, Surname: null, IsEdit: false, Icon: 'edit' }];

  }
  cancel() {
    this.showTable = false;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '250px',
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'Confirm') {
        this.deleteUserForDialog(element);
      }
    });
  }

  getErrorMessage() {
    return this.name.hasError('required') ? 'You must enter a value' :
      this.name.hasError('name') ? 'Not a valid name' : '';
  }

  emailGetErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit(newUser: User) {
    this.newUser = new User(0, '', 0, '', '', false, 'edit');
  }
}
