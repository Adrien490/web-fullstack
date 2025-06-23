import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  totalItems$!: Observable<number>;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.totalItems$ = new Observable((observer) => {
      this.cartService.cartItems$.subscribe(() => {
        observer.next(this.cartService.getTotalItems());
      });
    });
  }
}
