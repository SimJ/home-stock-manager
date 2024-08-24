import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../model/item';
import { InventoryService } from '../service/inventory.service';
import { HttpErrorResponse } from '@angular/common/http';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  @ViewChild('tableSection') tableSection: ElementRef | null = null;

  items: Item[] = [];
  newItem: Item = new Item(''); // 初期値をundefinedに変更
  selectedItem: Item | null = null;
  isEditMode: boolean = false; // 編集モードのフラグ
  nameError = false;
  quantityError = false;
  thresholdError = false;
  httpErrorMessage: string | null = null; // HTTPエラーメッセージ用

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.inventoryService.getItems()
      .subscribe(items => this.items = items);
  }

  getBackgroundColor(item: Item): string {
    if (item.quantity !== undefined && item.threshold !== undefined) {
      if (item.quantity < item.threshold) {
        return 'red';
      } else if (item.quantity === item.threshold) {
        return 'yellow';
      }
    }
    return 'white';
  }

  consumeItem(item: Item): void {
    console.log(item);
    if (item.quantity !== undefined && item.quantity > 0) {
      item.quantity--;
      this.inventoryService.updateItem(item).subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => this.handleError(error) // エラー処理
      });
    }
  }

  purchaseItem(item: Item): void {
    if (item.quantity !== undefined) {
      item.quantity++;
      this.inventoryService.updateItem(item).subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => this.handleError(error) // エラー処理
      });
    }
  }

  addItem(): void {
    this.resetErrors();
    this.httpErrorMessage = null; // エラーメッセージをリセット

    if (!this.newItem.name) {
      this.nameError = true;
    }
    if (this.newItem.quantity === undefined || this.newItem.quantity < 0) {
      this.quantityError = true;
    }
    if (this.newItem.threshold === undefined || this.newItem.threshold < 0) {
      this.thresholdError = true;
    }

    if (!this.nameError && !this.quantityError && !this.thresholdError) {
      this.inventoryService.addItem(this.newItem).subscribe({
        next: () => {
          this.getItems(); // アイテムリストを再取得
          this.newItem = new Item('', undefined, undefined); // フォームをリセット
        },
        error: (error: HttpErrorResponse) => this.handleError(error) // エラー処理
      });
    }
  }

  handleError(error: HttpErrorResponse): void {
    if (error.error instanceof ErrorEvent) {
      // クライアントサイドまたはネットワークエラー
      this.httpErrorMessage = `クライアントまたはネットワークエラー: ${error.error.message}`;
    } else {
      // サーバー側のエラー
      this.httpErrorMessage = `サーバーエラー (ステータスコード: ${error.status}): ${error.message}`;
    }
  }

  resetErrors(): void {
    this.nameError = false;
    this.quantityError = false;
    this.thresholdError = false;
  }

  selectItem(item: Item): void {
    this.selectedItem = { ...item }; // 編集用のアイテムをコピー
  }

  updateItem(): void {
    if (this.selectedItem) {
      this.inventoryService.updateItem(this.selectedItem).subscribe({
        next: () => {
          this.getItems(); // アイテムリストを再取得
          this.selectedItem = null; // 編集を終了
        },
        error: (error: HttpErrorResponse) => this.handleError(error) // エラー処理
      });
    }
  }

  deleteItem(): void {
    if (this.selectedItem?.id) {
      this.inventoryService.deleteItem(this.selectedItem.id).subscribe({
        next: () => {
          this.getItems(); // アイテムリストを再取得
          this.selectedItem = null; // 編集を終了
        },
        error: (error: HttpErrorResponse) => this.handleError(error) // エラー処理
      });
    }
  }

  cancelEdit(): void {
    this.selectedItem = null;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  takeScreenshot(): void {
    if (this.tableSection) {
      html2canvas(this.tableSection.nativeElement).then(canvas => {
        const img = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = img;
        link.download = 'table-screenshot.png';
        link.click();
      });
    }
  }
}
