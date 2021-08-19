import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';
import { Photo } from '../../_models/photo';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})

export class PhotosComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() getUserPhotoChange = new EventEmitter<string>();
  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  response:string;
  baseURL = environment.apiUrl;
  currentMain: Photo;

  constructor (private authService: AuthService, private userService: UserService, private alertifi: AlertifyService){
  }
 
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url:this.baseURL + 'users/' + this.authService.decodeToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;};
    this.uploader.onSuccessItem = (item, respons,status, headers) => {
      if(respons) {
          const res: Photo = JSON.parse(respons);
          const photo = {
              id: res.id,
              url: res.url,
              dateAdded: res.dateAdded,
              description: res.description,
              isMain: res.isMain
          };

          this.photos.push(photo);

          if(photo.isMain) {
            this.authService.changeUserPhoto(photo.url);
            this.authService.currentUser.photoUrl = photo.url;
            localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
          }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodeToken.nameid, photo.id).subscribe(() => {
      console.log('success');
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;

      this.authService.changeUserPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));

    }, error => {
        this.alertifi.error(error);
    });
  }

  deletePhoto(id: number) {
    this.alertifi.confirm('Czy jestes pewien że chcesz usunąć zdjęcie?',() => {
      this.userService.deletePhoto(this.authService.decodeToken.nameid,id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id),1);
        this.alertifi.success("Zdjęcie zostało usunięte");
      }, error => {
        this.alertifi.error("Nie udało sie usunąc zdjęcia");
      });
    });
  }

}
