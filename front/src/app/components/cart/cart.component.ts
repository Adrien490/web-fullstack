import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem, CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  totalPrice: number = 0;
  totalItems: number = 0;
  isProcessingOrder: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCartItems();

    this.cartItems$.subscribe(() => {
      this.totalPrice = this.cartService.getTotalPrice();
      this.totalItems = this.cartService.getTotalItems();
    });
  }

  updateQuantity(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);

    if (!isNaN(quantity)) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article du panier ?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  clearCart(): void {
    if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      this.cartService.clearCart();
    }
  }

  checkout(): void {
    if (this.totalItems === 0) {
      alert('Votre panier est vide !');
      return;
    }

    if (confirm('Voulez-vous confirmer votre commande ?')) {
      this.isProcessingOrder = true;

      this.cartService.cartItems$
        .subscribe((items) => {
          this.orderService.createOrder(items).subscribe({
            next: (order) => {
              alert(
                `Commande #${order.id} créée avec succès ! Total: ${order.total}€`
              );
              this.cartService.clearCart();
              this.router.navigate(['/account']);
            },
            error: () => {
              alert(
                'Une erreur est survenue lors de la création de votre commande.'
              );
              this.isProcessingOrder = false;
            },
          });
        })
        .unsubscribe();
    }
  }
}
