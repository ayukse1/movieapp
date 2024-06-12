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
    description: new FormControl("", Validators.required),
    imageUrl: new FormControl("", Validators.required),
    categoryId: new FormControl("", Validators.required)
  })

  get title() {
    return this.movieForm.get('title');
  }

  clearForm(){
    this.movieForm.patchValue({
      title: '',
      description: '',
      imageUrl: '',
      categoryId: ''
    });
  }

  createMovie() {

    const movie = { 
      id: 0,
      title: this.movieForm.value.title, 
      description: this.movieForm.value.description, 
      imageUrl: this.movieForm.value.imageUrl, 
      isPopular: false, 
      datePublished: new Date().getTime(), 
      categoryId: this.movieForm.value.categoryId
  };

  this.movieService.createMovie(movie).subscribe(data => {
    this.router.navigate(['/movies'])
  });
  }

  log(value: any) {
    console.log(value);
  }
}

