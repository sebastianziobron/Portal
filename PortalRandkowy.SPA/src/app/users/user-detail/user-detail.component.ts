import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService, private alertyify: AlertifyService, private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  
    this.galleryOptions = [
    {
      width: '600px',
      height: '400px',
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide
    },
  ];

    this.galleryImages = this.getImages();
    console.log(this.galleryImages);
}

  getImages() {
    const imagesUrls = [];

    for (let i = 0; i < this.user.photos.length; i++) {
        imagesUrls.push({
          small: this.user.photos[i].url,
          medium: this.user.photos[i].url,
          big: this.user.photos[i].url,
          description: this.user.photos[i].description
        });
    }

    return imagesUrls;

  }

}
