import { Component, OnInit } from '@angular/core';
import { InventoryAccountingScreenService } from 'src/app/core/services/inventory-accounting-screen.service';
import { Item } from 'src/app/shared/models/Item.model';

@Component({
  selector: 'app-inventory-accounting',
  templateUrl: './inventory-accounting.component.html',
  styleUrls: ['./inventory-accounting.component.css']
})
export class InventoryAccountingComponent implements OnInit {
  
  items! : Item[];
  selectedItemId: number = 0;
  loading = true;
  selectedStrategy = '';
  disabled=false;
  result!: number;

  constructor(private _inventoryAccountingScreenService: InventoryAccountingScreenService) { }
  
  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems() {
    this.loading = true;
    this._inventoryAccountingScreenService.getItems().subscribe({
      next: (response) => {
        this.items = response;
        this.loading = false;
      },
    });
  }
  onSelectItem(event: any) {
    this.selectedItemId = event.target.value;
  }

  onSubmit() {
    this.disabled = true;
    this._inventoryAccountingScreenService.processTransactions(this.selectedItemId, this.selectedStrategy).subscribe({
      next: (response) => {
        this.disabled = false;
        this.result = response.result
      },
    })
  }
}
