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



}
