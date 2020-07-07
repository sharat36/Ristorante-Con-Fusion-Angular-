import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params,  ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  commentForm: FormGroup;
  comment: Comment;

  @ViewChild('cform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Author Name is required.',
      'minlength': 'Author Name must be at least 2 characters long.'
    },

    'comment': {
      'required': 'Comment is required.'
    }
  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe((dishIds) => 
      this.dishIds = dishIds);

    this.route.params.pipe(switchMap((params: Params) => 
      this.dishService.getDish(params['id']))).subscribe((dish) => 
      {this.dish = dish; this.setPrevNext(dish.id); });
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', Validators.required],
      rating: 5,
      date: ''
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);

    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onValueChanged(data?: any) {
    if(!this.commentForm) { return; }

    const form = this.commentForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';

        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];

          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    var d = new Date();
    var n = d.toISOString();
    this.commentForm.value['date'] = n;

    this.comment = this.commentForm.value;
    this.dish.comments.push(this.comment);

    console.log(this.comment);

    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5,
      date: ''
    });

    this.commentFormDirective.resetForm(
      {rating: 5}
    );
  }

}
