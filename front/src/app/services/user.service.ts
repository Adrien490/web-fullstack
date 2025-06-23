import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from './order.service';

export type User = {
  id: number;
  email: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  phone?: string;
  created_at: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserId = 1;

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${this.currentUserId}`);
  }

  updateCurrentUser(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${this.currentUserId}`, user);
  }

  getCurrentUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.apiUrl}/${this.currentUserId}/orders`
    );
  }
}
