import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User;
  photoUrl: string;

  @ViewChild('editform') editForm: NgForm;
  @HostListener('window:beforeunload',['$event'])
  unloadNotification($event: any) {
    if(this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(private route: ActivatedRoute, private alertyfi: AlertifyService, private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.user = data.user;
    });

    this.authService.currenPhotoUrl.subscribe(photourl => this.photoUrl = photourl);
  }

  updateUser() {

    this.userService.updateUser(this.authService.decodeToken.nameid, this.user)
                    .subscribe( next => {
                      this.alertyfi.success("Profil pomyślnie zaktualizowany");
                      this.editForm.reset(this.user);
                    }, error => {
                      this.alertyfi.error(error);
                    });

  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }

}
