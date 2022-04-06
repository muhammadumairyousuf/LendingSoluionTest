import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable ,from } from 'rxjs';
import { filter,map } from 'rxjs/operators'; 
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService,RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor';
import * as _ from 'lodash';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class ArticleComponent implements OnInit {
  dataSaved = false;
  articleForm: any;
  allArticles: Observable<Article[]>;
  articleIdUpdate = null;
  massage = null;
  imageError=null;
  cardImageBase64:any;
  isImageSaved:boolean;
  public tools: object = {
    items: [
           'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
           'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
           'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
           'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
           'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
           'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
   };
  constructor(private formbulider: FormBuilder, private ArticleService: ArticleService) { }

  ngOnInit() {
    this.articleForm = this.formbulider.group({
      title: ['', [Validators.required]],
      creationDate: ['', [Validators.required]],
      category: ['', [Validators.required]],
      author: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
    this.loadAllArticles();
  }
  loadAllArticles() {
    this.allArticles = this.ArticleService.getAllArticles();
  }
  onFormSubmit() {
    debugger;
    this.dataSaved = false;
    const Article = this.articleForm.value;
    Article.image=this.cardImageBase64;
    this.CreateArticle(Article);
    this.articleForm.reset();
  }
  loadArticleToEdit(ArticleId: string) {
    this.ArticleService.getArticleById(ArticleId).subscribe(Article => {
      this.massage = null;
      this.dataSaved = false;
      this.articleIdUpdate = Article.id;
      this.articleForm.controls['title'].setValue(Article.title);
      this.articleForm.controls['creationDate'].setValue(Article.creationDate);
      this.articleForm.controls['category'].setValue(Article.category);
      this.articleForm.controls['author'].setValue(Article.author);
      this.articleForm.controls['content'].setValue(Article.content);
      this.cardImageBase64=Article.image;
      this.isImageSaved = true;
    });

  }
  CreateArticle(article: Article) {
    if (this.articleIdUpdate == null) {
      this.ArticleService.createArticle(article).subscribe(
        () => {
          this.dataSaved = true;
          this.massage = 'Record saved Successfully';
          this.loadAllArticles();
          this.articleIdUpdate = null;
          this.articleForm.reset();
          this.cardImageBase64 = null;
          this.isImageSaved = false;
        }
      );
    } else {
      article.id = this.articleIdUpdate;
      this.ArticleService.updateArticle(article).subscribe(() => {
        this.dataSaved = true;
        this.massage = 'Record Updated Successfully';
        this.loadAllArticles();
        this.articleIdUpdate = null;
        this.articleForm.reset();
        this.cardImageBase64 = null;
        this.isImageSaved = false;
      });
    }
  }
 
  deleteArticle(ArticleId: string) {
    if (confirm("Are you sure you want to delete this ?")) {  
    this.ArticleService.deleteArticleById(ArticleId).subscribe(() => {
      this.dataSaved = true;
      this.massage = 'Record Deleted Succefully';
      this.loadAllArticles();
      this.articleIdUpdate = null;
      this.articleForm.reset();
      this.cardImageBase64=null;
      this.isImageSaved = false;
    });
  }
}
  resetForm() {
    this.articleForm.reset();
    this.massage = null;
    this.dataSaved = false;
  }
  searchArticle(searchvalue){
    debugger;
    this.allArticles=this.ArticleService.getAllArticles();
  
    this.allArticles=this.allArticles.pipe (
      map(items => 
       items.filter(item => item.title.toLowerCase() == searchvalue.toLowerCase())) );

  }
  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';

            return false;
        }

        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
            this.imageError = 'Only Images are allowed ( JPG | PNG )';
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);


                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
}
removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
}
}
