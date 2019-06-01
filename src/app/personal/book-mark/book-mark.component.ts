import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, startWith, takeWhile, take } from 'rxjs/operators';

import { Bookmark } from '../../interface/response.interface';
import { AuthService } from '../../providers/auth.service';
import { PersonalService, StoreAction } from '../providers/personal.service';

@Component({
    selector: 'ratel-book-mark',
    templateUrl: './book-mark.component.html',
    styleUrls: ['./book-mark.component.scss'],
})
export class BookMarkComponent implements OnInit, OnDestroy {

    /**
     * 根据Bookmark接口设置的前三个字段，用来给 material table 提供 sort 功能 。
     */
    displayedColumns: string[] = ['title', 'createdAt', 'author', 'operate'];

    bookmarks: Observable<MatTableDataSource<Bookmark>>;

    count: Observable<number>;

    @ViewChild(MatPaginator, { static: false })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: false })
    sort: MatSort;

    spy$: Subject<Bookmark> = new Subject();

    isAlive = true;

    constructor(private _authService: AuthService, private _personalService: PersonalService) {}

    ngOnInit() {
        this.initialModel();
    }

    initialModel() {
        const id = this._authService.userObs.pipe(
            filter(user => !!user),
            map(user => user.id),
        );
        const response = combineLatest(
            this._personalService.getBookmarks(id).pipe(take(1)),
            this.spy$.asObservable().pipe(startWith(null)),
        ).pipe(
            map(([res, spy]) => {
                if (spy) {
                    const { articles, count } = res;

                    return { articles: articles.filter(item => item.id !== spy.id), count: count - 1 };
                } else {
                    return res;
                }
            }),
            takeWhile(() => this.isAlive),
        );

        this.bookmarks = response.pipe(
            map(res => {
                const data = new MatTableDataSource(res.articles);

                data.paginator = this.paginator;

                data.sort = this.sort;

                return data;
            }),
        );

        this.count = response.pipe(map(res => res.count));
    }

    remove(target: Bookmark): void {
        const request = this._authService.userObs.pipe(
            map(user => ({ id: user.id, articleId: target.id, operate: StoreAction.REMOVE })),
            take(1),
        );

        this._personalService.storeArticle(request, this.spy(target));
    }

    private spy = (target: Bookmark): (() => void) => {
        return () => {
            this.spy$.next(target);
        };
    };

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}
