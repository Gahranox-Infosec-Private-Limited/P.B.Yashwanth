import { Component, Input, Output, EventEmitter } from '@angular/core';

// Define BillItem interface here instead of importing
export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  manager?: string;
}

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent {
  @Input() item?: BillItem;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  editedItem: BillItem = {
    id: '',
    name: '',
    quantity: 1,
    price: 0,
    manager: ''
  };

  managers = ['Manager 1', 'Manager 2', 'Manager 3', 'Manager 4'];
  
  ngOnInit() {
    if (this.item) {
      this.editedItem = { ...this.item };
    }
  }

  onSave() {
    if (this.isFormValid()) {
      this.save.emit();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  isFormValid(): boolean {
    return !!this.editedItem.name?.trim() && 
           this.editedItem.quantity > 0 && 
           this.editedItem.price >= 0;
  }

  incrementQuantity() {
    this.editedItem.quantity++;
  }

  decrementQuantity() {
    if (this.editedItem.quantity > 1) {
      this.editedItem.quantity--;
    }
  }

  calculateTotal(): number {
    return this.editedItem.quantity * this.editedItem.price;
  }
}