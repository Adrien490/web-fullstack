import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export type CartItem = {
  product: Product;
  quantity: number;
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.updateCart(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        currentItems[itemIndex].quantity = quantity;
        this.updateCart(currentItems);
      }
    }
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.value;
    const filteredItems = currentItems.filter(
      (item) => item.product.id !== productId
    );
    this.updateCart(filteredItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  getTotalItems(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItems.next(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }
}
