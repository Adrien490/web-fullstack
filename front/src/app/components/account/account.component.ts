import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  private userService = inject(UserService);

  user: User | null = null;
  orders: any[] = [];
  loading = true;
  error: string | null = null;
  isEditing = false;
  isSaving = false;

  editedUser: any = {};

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.editedUser = { ...user };
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur de chargement';
        this.loading = false;
      },
    });

    this.userService.getCurrentUserOrders().subscribe({
      next: (orders) => (this.orders = orders),
      error: () => {},
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.editedUser = { ...this.user };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedUser = { ...this.user };
  }

  saveUser(): void {
    this.isSaving = true;
    this.userService.updateCurrentUser(this.editedUser).subscribe({
      next: (user) => {
        this.user = user;
        this.isEditing = false;
        this.isSaving = false;
      },
      error: () => {
        this.isSaving = false;
        alert('Erreur de mise à jour');
      },
    });
  }
}
