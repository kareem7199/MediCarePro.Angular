import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserCreationScreenService } from 'src/app/core/services/user-creation-screen.service';
import { Role } from 'src/app/shared/models/Role.model';
import { Specialty } from 'src/app/shared/models/Specialty.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  showSpecialties = false;
  showContent = false;
  roles : Role[] = []
  selectedRoles : string[] = []
  specialties : Specialty[] = []
  selectedSpecialty : Specialty | null = null;
  firstName : string = "";
  secondName : string = "";
  phoneNumber : string = "";
  email : string = "";

  constructor(private _userCreationScreenService: UserCreationScreenService , private _toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchRoles();
  }

  onRoleChange(e : any) {
    if(e.target.checked) {
      this.selectedRoles.push(e.target.value);
      if(e.target.value == "Physician") this.fetchSpecialties();
    }
    else {
      this.selectedRoles.splice(this.selectedRoles.indexOf(e.target.value), 1);
      if(e.target.value == "Physician") {
        this.showSpecialties = false;
        this.selectedSpecialty = null;
      }
    }
  }

  fetchRoles() {
    this._userCreationScreenService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
        this.showContent = true;
      },
      error: (error) => {
        this._toastr.error(error , 'Error');
      },
    });
  }

  fetchSpecialties() {
    this._userCreationScreenService.getSpecialties().subscribe({
      next: (response) => {
        this.specialties = response;
        this.showSpecialties = true;
      },
      error: (error) => {
        this._toastr.error(error , 'Error');
      },
    });
  }

  onSubmit() {
    this._userCreationScreenService.createUser(this.firstName , this.secondName , this.phoneNumber , this.email , this.selectedRoles, this.selectedSpecialty).subscribe({
      next: (response) => {
        this._toastr.success('User created successfully', 'Success');
        this.reset();
      },
      error: (error) => {
        this._toastr.error("Something went wrong", 'Error');
      },
    });
  }

  reset() {
    this.firstName = "";
    this.secondName = "";
    this.phoneNumber = "";
    this.email = "";
    this.selectedRoles = [];
    this.selectedSpecialty = null;
  }

  onSelectSpecialty(e : any) {
    this.selectedSpecialty = e.target.value;
    console.log(e.target.value)
  }
}
