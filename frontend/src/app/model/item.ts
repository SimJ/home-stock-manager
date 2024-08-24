export class Item {
    id?: number; // idは任意フィールドにしてサーバー側で生成
    name: string;
    quantity?: number;
    threshold?: number;
  
    constructor(name: string, quantity?: number, threshold?: number, id?: number) {
      if (id !== undefined) {
        this.id = id;
      }
      this.name = name;
      this.quantity = quantity;
      this.threshold = threshold;
    }
  }