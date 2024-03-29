import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  public title = 'jungles';
  public titles: { title: string; url: string }[] = [];
  public showMonkey = false;
  private monkeyUrls = ['/', '/tasks', '/project'];
  public hideMenu = false;

  constructor(
    private routee: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public loadingService: LoadingService,
  ) {
    this.loadingService.changeDetectorRef = cdRef;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => {
          if (this.monkeyUrls.indexOf((event as NavigationEnd).url) > -1) {
            this.showMonkey = true;
          } else {
            this.showMonkey = false;
          }
          return this.routee;
        }),
        // eslint-disable-next-line complexity
        map((route: ActivatedRoute) => {
          const routes: { title: string; url: string }[] = [];
          let className = '';
          this.hideMenu = false;
          while (route.firstChild) {
            // eslint-disable-next-line no-param-reassign
            route = route.firstChild;
            const { title, url, style, class: pageClass, hideMenu } = route.snapshot.data;
            const { routeConfig } = route.snapshot;
            this.hideMenu = !!hideMenu;
            if (pageClass) {
              className = pageClass;
            }
            if (style) {
              this.setStyle(style);
            }
            if (title && routeConfig?.path) {
              routes.push({
                title,
                url: url || `${routes.map((r) => r.url).join('/')}/${routeConfig.path}`,
              });
            }
          }
          document.body.className = className;
          return routes;
        }),
      )
      // задаем
      .subscribe((titles) => {
        this.titles = [];
        if (titles?.length) {
          this.titles = [
            {
              title: 'Главная',
              url: `/`,
            },
            ...titles,
          ];
        }
      });
  }

  private setStyle(style: any) {
    const contentBlock = document.querySelector('.main-content') as HTMLDivElement;
    if (!contentBlock) {
      return;
    }
    Object.keys(style).forEach((key: string) => {
      contentBlock.style.setProperty(key, style[key]);
    });
    // document.documentElement.style.backgroundImage = style.background;
  }
}
