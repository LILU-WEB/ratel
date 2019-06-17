import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MarkdownModule } from 'ngx-markdown';

import { AuthModule } from '../auth/auth.module';
import { CodemirrorModule } from '../codemirror/codemirror.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../shared/shared.module';
import { ArticleCreationComponent } from './article-creation/article-creation.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleOverviewComponent } from './article-overview/article-overview.component';
import { ArticleComponent } from './article/article.component';
import { HotArticleComponent } from './hot-article/hot-article.component';
import { ImageAddressPipe } from './pipes/article.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MarkdownModule.forChild(),
        CommentModule,
        CodemirrorModule,
        AuthModule,
        RouterModule,
        ImageCropperModule,
    ],
    declarations: [
        ArticleComponent,
        ArticleOverviewComponent,
        HotArticleComponent,
        ArticleCreationComponent,
        ArticleListComponent,
        ImageAddressPipe,
    ],
    exports: [
        ArticleComponent,
        ArticleOverviewComponent,
        HotArticleComponent,
        ArticleCreationComponent,
        ArticleListComponent,
    ],
})
export class ArticleModule {}
