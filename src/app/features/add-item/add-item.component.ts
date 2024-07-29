import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AddItemScreenService } from 'src/app/core/services/add-item-screen.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent {
  constructor(
    private _addItemScreenService: AddItemScreenService,
    private _toastr: ToastrService
  ) {}

  name: string = '';

  onSubmit() {
    this._addItemScreenService.addItem(this.name).subscribe({
      next: (response) => {
        this._toastr.success('Item created successfully', 'Success');
        this.name = '';
      },
      error: (error) => {
        console.log(error);
        this._toastr.error(error.error.message, 'Error');
      },
    });
  }
}
