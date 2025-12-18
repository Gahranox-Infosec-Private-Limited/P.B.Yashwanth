import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Add this for PDF generation
declare var html2pdf: any;

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  manager?: string;
}

@Component({
    selector: 'app-billing-flow',
    templateUrl: './billing-flow.component.html',
    styleUrls: ['./billing-flow.component.css'],
    standalone: false
})
export class BillingFlowComponent implements OnInit {
  currentStep = 1;
  items: BillItem[] = [];
  newItemName = '';
  selectedSlip = '';
  applyGST = true;
  gstPercentage: number = 18; // Dynamic GST percentage
  showItemModal = false;
  currentEditingItem: BillItem = this.createEmptyItem();
  
  // Notification System
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  
  // New V1 Features
  billNumber = '';
  currentDate = '';
  customerName = '';

  // PDF Generation State
  isGeneratingPDF = false;

  commonGSTRates = [5, 12, 18, 28]; // Common GST rates for quick selection
  slipTypes = ['Retail Slip', 'Wholesale Slip', 'Proforma Slip'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateBillNumber();
    this.updateCurrentDate();
  }

  // Generate unique bill number
  generateBillNumber() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(5, '0');
    this.billNumber = `RS-${year}-${randomNum}`;
  }

  // Update current date and time
  updateCurrentDate() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Step 1: Add Item
  addItem() {
    if (this.newItemName.trim()) {
      const newItem: BillItem = {
        id: Date.now().toString(),
        name: this.newItemName.trim(),
        quantity: 1,
        price: 0
      };
      this.items.push(newItem);
      this.newItemName = '';
      
      this.showToast('Item added successfully', 'success');
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.showToast('Item removed', 'success');
  }

  // Step 2: Slip Selection
  selectSlip(slip: string) {
    this.selectedSlip = slip;
    this.showToast(`${slip} selected`, 'success');
  }

  getSlipIcon(slip: string): string {
    switch(slip) {
      case 'Retail Slip': return 'fas fa-shopping-cart';
      case 'Wholesale Slip': return 'fas fa-pallet';
      case 'Proforma Slip': return 'fas fa-file-invoice';
      default: return 'fas fa-receipt';
    }
  }

  getSlipDescription(slip: string): string {
    switch(slip) {
      case 'Retail Slip': return 'Standard billing for retail customers';
      case 'Wholesale Slip': return 'Bulk orders with wholesale pricing';
      case 'Proforma Slip': return 'Preliminary invoice for approval';
      default: return '';
    }
  }

  // Step 3: GST Selection - DYNAMIC PERCENTAGE INPUT
  onGSTToggle() {
    if (this.applyGST) {
      if (this.gstPercentage === 0) {
        this.gstPercentage = 18; // Set default if zero
      }
      this.showToast('GST applied to bill', 'success');
    } else {
      this.gstPercentage = 0;
      this.showToast('GST removed from bill', 'success');
    }
  }

  setGSTPercentage(percentage: number): void {
    this.gstPercentage = percentage;
    this.applyGST = true;
    this.showToast(`GST ${percentage}% applied`, 'success');
  }

  onGSTPercentageChange(): void {
    // Called when user manually inputs GST percentage
    if (this.gstPercentage > 0) {
      this.applyGST = true;
    } else if (this.gstPercentage === 0) {
      this.applyGST = false;
    }
  }

  calculateGSTAmount(): number {
    if (!this.applyGST || this.gstPercentage <= 0) {
      return 0;
    }
    const subtotal = this.calculateSubtotal();
    return (subtotal * this.gstPercentage) / 100;
  }

  // Step 4: Item Details
  openItemDetails() {
    if (this.items.length === 0) {
      this.showToast('Please add items first', 'error');
      return;
    }
    
    // Edit the first item if none is selected
    if (!this.currentEditingItem.id) {
      this.editItemDetails(this.items[0]);
    }
  }

  editItemDetails(item: BillItem) {
    this.currentEditingItem = { ...item };
    this.showItemModal = true;
  }

  closeItemModal() {
    this.showItemModal = false;
    this.currentEditingItem = this.createEmptyItem();
  }

  saveItemDetails() {
    if (this.currentEditingItem.name && this.currentEditingItem.quantity > 0 && this.currentEditingItem.price >= 0) {
      const index = this.items.findIndex(item => item.id === this.currentEditingItem.id);
      if (index !== -1) {
        this.items[index] = { ...this.currentEditingItem };
      }
      
      this.closeItemModal();
      this.showToast('Item details saved', 'success');
    } else {
      this.showToast('Please fill all required fields correctly', 'error');
    }
  }

  createEmptyItem(): BillItem {
    return {
      id: '',
      name: '',
      quantity: 1,
      price: 0,
      manager: ''
    };
  }

  // Step 5: Premium Features - Navigate to Coming Soon page
  navigateToComingSoon(feature: string) {
    // Store the feature name to show in the coming soon page
    localStorage.setItem('comingSoonFeature', feature);
    this.router.navigate(['/coming-soon']);
  }

  // Show toast for features that don't navigate
  showComingSoon(feature: string) {
    this.showToast(`${feature} - Coming Soon in RASEED Premium!`, 'success');
  }

  // V1 Billing Features - FIXED PDF GENERATION
  async generatePDF() {
    if (this.items.length === 0) {
      this.showToast('Please add items to generate a bill', 'error');
      return;
    }
    
    this.isGeneratingPDF = true;
    this.showToast('Generating PDF...', 'success');
    
    try {
      // Create PDF content
      const element = this.createPDFContent();
      
      const options = {
        margin: 10,
        filename: `RASEED-Bill-${this.billNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      // Generate PDF using html2pdf
      await html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .get('pdf')
        .then((pdf: any) => {
          // Save the PDF
          pdf.save(options.filename);
        });
      
      this.showToast('PDF downloaded successfully!', 'success');
      
    } catch (error) {
      console.error('PDF generation error:', error);
      this.showToast('PDF generation failed, trying fallback...', 'error');
      this.fallbackPDFGeneration();
    } finally {
      this.isGeneratingPDF = false;
    }
  }

  private createPDFContent(): HTMLElement {
    const element = document.createElement('div');
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.padding = '20px';
    element.style.maxWidth = '800px';
    element.style.margin = '0 auto';
    
    element.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #667eea; padding-bottom: 20px;">
        <h1 style="color: #667eea; margin: 0 0 10px 0; font-size: 28px;">RASEED BILL</h1>
        <p style="color: #666; margin: 0;">Smart Billing Made Simple</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
        <div style="flex: 1;">
          <strong>Bill No:</strong> ${this.billNumber}<br>
          <strong>Date:</strong> ${this.currentDate}
        </div>
        ${this.customerName ? `
          <div style="flex: 1;">
            <strong>Customer:</strong> ${this.customerName}
          </div>
        ` : ''}
        ${this.selectedSlip ? `
          <div style="flex: 1;">
            <strong>Slip Type:</strong> ${this.selectedSlip}
          </div>
        ` : ''}
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #ddd; font-size: 14px;">
        <thead>
          <tr style="background: #667eea; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; width: 40%;">Item Description</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd; width: 15%;">Quantity</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd; width: 20%;">Unit Price (₹)</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd; width: 25%;">Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${this.items.map((item, index) => `
            <tr style="border-bottom: 1px solid #ddd; ${index % 2 === 0 ? 'background: #f8f9fa;' : ''}">
              <td style="padding: 12px; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">₹${item.price.toFixed(2)}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">₹${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="text-align: right; font-size: 16px; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <div style="margin-bottom: 10px; display: flex; justify-content: space-between; max-width: 300px; margin-left: auto;">
          <span><strong>Subtotal:</strong></span>
          <span>₹${this.calculateSubtotal().toFixed(2)}</span>
        </div>
        ${this.applyGST && this.gstPercentage > 0 ? `
          <div style="margin-bottom: 10px; display: flex; justify-content: space-between; max-width: 300px; margin-left: auto;">
            <span><strong>GST (${this.gstPercentage}%):</strong></span>
            <span>₹${this.calculateGSTAmount().toFixed(2)}</span>
          </div>
        ` : ''}
        <div style="font-size: 18px; margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea; display: flex; justify-content: space-between; max-width: 300px; margin-left: auto;">
          <span><strong>Grand Total:</strong></span>
          <span style="color: #667eea; font-weight: bold;">₹${this.calculateTotal().toFixed(2)}</span>
        </div>
      </div>
      
      <div style="margin-top: 50px; text-align: center; color: #666; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="margin: 5px 0;">Thank you for your business!</p>
        <p style="margin: 5px 0; font-weight: bold;">Generated by RASEED Billing System v2.0</p>
        <p style="margin: 5px 0; font-size: 12px;">www.raseed.com | support@raseed.com</p>
      </div>
    `;
    
    return element;
  }

  private fallbackPDFGeneration() {
    // Fallback: Open print dialog
    const printContent = this.createPDFContent().innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>RASEED Bill - ${this.billNumber}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                margin: 0; 
                max-width: 800px;
                margin: 0 auto;
              }
              @media print {
                body { margin: 0; padding: 15px; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        // Don't close immediately - let user see the print dialog
      }, 500);
    }
  }

  saveBill() {
    if (this.items.length === 0) {
      this.showToast('Please add items to save the bill', 'error');
      return;
    }
    
    // Save bill data to localStorage
    const billData = {
      billNumber: this.billNumber,
      date: this.currentDate,
      customerName: this.customerName,
      items: this.items,
      subtotal: this.calculateSubtotal(),
      gstPercentage: this.gstPercentage,
      gstAmount: this.calculateGSTAmount(),
      total: this.calculateTotal(),
      slipType: this.selectedSlip
    };
    
    // Get existing bills or initialize empty array
    const existingBills = JSON.parse(localStorage.getItem('raseedBills') || '[]');
    existingBills.push(billData);
    localStorage.setItem('raseedBills', JSON.stringify(existingBills));
    
    this.showToast('Bill saved successfully', 'success');
  }

  newBill() {
    this.items = [];
    this.currentEditingItem = this.createEmptyItem();
    this.selectedSlip = '';
    this.applyGST = true;
    this.gstPercentage = 18; // Reset to default
    this.customerName = '';
    this.isGeneratingPDF = false;
    
    this.generateBillNumber();
    this.updateCurrentDate();
    
    this.showToast('New bill created', 'success');
  }

  // Calculations
  calculateSubtotal(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const gstAmount = this.calculateGSTAmount();
    return subtotal + gstAmount;
  }

  // New Toast Notification System
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }

  hideNotification() {
    this.showNotification = false;
  }
}