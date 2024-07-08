import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/category.model';
import { MovieService } from '../movie.service';
import { Router } from '@angular/router';
import { AlertifyService } from '../../shared/alertify.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-movie-create',
  templateUrl: './movie-create.component.html',
  styleUrl: './movie-create.component.scss',
  providers: [CategoryService, MovieService]
})
export class MovieCreateComponent implements OnInit{

  categories: Category[];
  model: any = {
    categoryId: ''
  };

  constructor(private categoryService: CategoryService,
              private movieService: MovieService,
              private router: Router,
              private alertify: AlertifyService) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data =>{
      this.categories = data;
    })
  }

  movieForm = new FormGroup({
    title: new FormControl("", [Validators.required, Validators.minLength(5)]),
    agelimit: new FormControl("", Validators.required),
    imdb: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    moviestars: new FormControl("", Validators.required),
    creators: new FormControl("", Validators.required),
    imageUrl: new FormControl("", Validators.required),
    videoUrl: new FormControl("", Validators.required),
    categoryId: new FormControl("", Validators.required),
    year: new FormControl("", Validators.required),
  })

  get title() {
    return this.movieForm.get('title');
  }

  clearForm(){
    this.movieForm.patchValue({
      title: '',
      agelimit: '',
      imdb: '',
      description: '',
      moviestars: '',
      creators: '',
      imageUrl: '',
      videoUrl: '',
      categoryId: '',
      year: ''
    });
  }

  createMovie() {

    const movie = { 
      id: 0,
      title: this.movieForm.value.title,
      agelimit: Number(this.movieForm.value.agelimit),
      imdb: Number(this.movieForm.value.imdb),
      description: this.movieForm.value.description,
      moviestars: this.movieForm.value.moviestars,
      creators: this.movieForm.value.creators,
      imageUrl: this.movieForm.value.imageUrl,
      videoUrl: this.movieForm.value.videoUrl,
      isPopular: false, 
      datePublished: new Date().getTime(), 
      categoryId: this.movieForm.value.categoryId,
      year: Number(this.movieForm.value.year)
  };

  this.movieService.createMovie(movie).subscribe(data => {
    this.router.navigate(['/movies'])
  });
  }

  log(value: any) {
    console.log(value);
  }
}

