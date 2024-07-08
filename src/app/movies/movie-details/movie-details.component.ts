import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../shared/alertify.service';
import { CategoryService } from '../../category/category.service';
import { AuthService } from '../../auth/auth.service';
import { Category } from '../../category/category.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss',
  providers: [MovieService]
})
export class MovieDetailsComponent implements OnInit{
  @ViewChild('movieVideo') movieVideo: ElementRef;
  movie: Movie;
  loading: boolean = false;
  movieList: string[] = [];
  userId: string;
  categoryName: string;

  constructor(private movieService: MovieService,
              private activatedRoute: ActivatedRoute,
              private alertify: AlertifyService,
              private categoryService: CategoryService, // Inject CategoryService
              private authService: AuthService,
              private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.loading = true;
      this.movieService.getMovieById(params["movieId"]).subscribe(data => {
        this.movie = data;
        this.loading = false;
        this.getCategoryName(data.categoryId);
      })
    })
  }

  getCategoryName(categoryId: string) {
    this.categoryService.getCategoryById(categoryId).subscribe(category => {
      this.categoryName = category.name;
    });
  }
  scrollToVideo() {
    this.movieVideo.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  showVideo() {
    this.movieVideo.nativeElement.hidden = false;
    this.scrollToVideo();
  }

  getButtonstate(movie: Movie): boolean {
    return this.movieList.includes(movie.id);
  }

  addToList($event: any, movie: Movie) {
    const button = $event.target;

    if (!this.getButtonstate(movie)) {
      // Add to list
      this.movieService.addToMyList({ userId: this.userId, movieId: movie.id }).subscribe(
        () => {
          this.alertify.success(movie.title + ' added to the list.');
          this.movieList.push(movie.id);
          this.updateButtonState(button, true);
        },
        error => {
          this.alertify.error('Failed to add ' + movie.title + ' to the list.');
        }
      );
    } else {
      // Remove from list
      this.movieService.removeFromMyList({ userId: this.userId, movieId: movie.id }).subscribe(
        () => {
          this.alertify.success(movie.title + ' removed from the list.');
          const index = this.movieList.indexOf(movie.id);
          if (index > -1) {
            this.movieList.splice(index, 1);
          }
          this.updateButtonState(button, false);
        },
        error => {
          this.alertify.error('Failed to remove ' + movie.title + ' from the list.');
        }
      );
    }
  }

  updateButtonState(button: any, isInList: boolean) {
    if (isInList) {
      button.innerText = 'Remove from list';
      button.classList.remove('btn-primary');
      button.classList.add('btn-danger');
    } else {
      button.innerText = 'Add to the list';
      button.classList.remove('btn-danger');
      button.classList.add('btn-primary');
    }
  }
 
}
