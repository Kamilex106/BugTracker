import {Component, OnInit} from '@angular/core';
import {User} from '../../common/user';
import {UserService} from '../../services/user.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  users: User[] = [];
  message: string | null = null; // komunikat sukcesu/err
  messageType: 'success' | 'error' | null = null;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.listUsers();
  }

  listUsers() {
    this.userService.getUsersList().subscribe(
      data => {
        this.users = data;
      }
    )

  }

  deleteUser(id: number) {
    // tu zamiast confirm - np. po prostu usuwamy, ale można rozbudować o modal potwierdzający
    // dla uproszczenia pomijam potwierdzenie, ale możesz zrobić osobny modal

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
        this.showMessage('User deleted successfully', 'success');
      },
      error: err => {
        console.error('Error deleting user:', err);
        this.showMessage('An error occurred while deleting the user.', 'error');
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;

    // komunikat znika po 3 sekundy
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
    }, 3000);
  }

  toggleStatus(user: User) {
    this.userService.updateUserStatus(user.id!, !user.enabled).subscribe({
      next: () => {
        user.enabled = !user.enabled;
        this.showMessage(`User ${user.username} ${user.enabled ? 'activated' : 'deactivated'}.`, 'success');
      },
      error: err => this.showMessage('Could not update user status.', 'error')
    });
  }


}
