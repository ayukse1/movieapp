import { Component, OnInit } from '@angular/core';
import { Movie } from './movie.model';
import { AlertifyService } from '../shared/alertify.service';
import { MovieService } from './movie.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  providers: [MovieService, CategoryService]
})
export class MoviesComponent implements OnInit {
  title = 'Film Listesi';
  movies: Movie[] = [];
  categories: Category[] = []; // Store categories
  filteredMovies: Movie[] = [];
  userId: string;
  movieList: string[] = [];
  filterText: string = '';
  error: any = '';
  loading: boolean = false;
  selectedCategoryNames = ['Macera', 'Komedi', 'Dram']; // Default to selected categories

  constructor(
    private alertify: AlertifyService,
    private movieService: MovieService,
    private categoryService: CategoryService, // Inject CategoryService
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.userId = user.id;

        this.activatedRoute.params.subscribe(params => {
          this.loading = true;

          this.movieService.getMovies(params['categoryId']).subscribe(
            data => {
              this.movies = data;
              this.filteredMovies = this.movies;

              this.movieService.getMyList(this.userId).subscribe(data => {
                this.movieList = data;
                console.log(this.movieList);
              });

              this.loading = false;
            },
            error => {
              this.error = error;
              this.loading = false;
            }
          );

          // Fetch categories
          this.categoryService.getCategories().subscribe(data => {
            this.categories = data;
          });
        });
      }
    });
  }

  onInputChange() {
    const filterTextLower = this.filterText.toLowerCase();
    this.filteredMovies = this.filterText
      ? this.movies.filter(m =>
          m.title.toLowerCase().includes(filterTextLower) ||
          m.description.toLowerCase().includes(filterTextLower)
        )
      : this.movies;
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

  scroll(direction: number, containerClass: string) {
    const container = document.querySelector(containerClass);
    const scrollAmount = container.clientWidth * direction;
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  isInList(movieId: string): boolean {
    return this.movieList.includes(movieId);
  }

  getMoviesByCategory(categoryId: string): Movie[] {
    return this.movies.filter(movie => movie.categoryId === categoryId);
  }
}
