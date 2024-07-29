import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AddTransactionScreenService } from 'src/app/core/services/add-transaction-screen.service';
import { Item } from 'src/app/shared/models/Item.model';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
})
export class AddTransactionComponent implements OnInit {
  constructor(private _addTransactionService: AddTransactionScreenService , private _toastr: ToastrService) {}

  public items!: Item[];
  public loading = true;
  disabled = false;
  selectedItemId: number = 0;
  selectedAction = '';
  quantity: number = 1;
  amount: number = 1;

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems() {
    this.loading = true;
    this._addTransactionService.getItems().subscribe({
      next: (response) => {
        this.items = response;
        this.loading = false;
      },
    });
  }

  onSubmit() {
    this.disabled = true;
    this._addTransactionService
      .addTransaction(
        this.amount,
        this.quantity,
        this.selectedItemId,
        this.selectedAction
      )
      .subscribe({
        next: (response) => {
          this.disabled = false;
          this._toastr.success('Transaction created successfully', 'Success');
          this.selectedAction = '';
          this.selectedItemId = 0;
          this.quantity = 1;
          this.amount = 1;
        },
        error: (error) => {
          this.disabled = false;
          this._toastr.error("Something went wrong", 'Error');
        },
      });
  }

  onSelectItem(event: any) {
    this.selectedItemId = event.target.value;
  }
}
