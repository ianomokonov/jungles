import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  public title = 'jungles';
  public titles: { title: string; url: string }[] = [];
  public showMonkey = false;
  private monkeyUrls = ['/', '/tasks'];

  constructor(private routee: ActivatedRoute, private router: Router) {
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
        map((route: ActivatedRoute) => {
          const routes: { title: string; url: string }[] = [];
          while (route.firstChild) {
            // eslint-disable-next-line no-param-reassign
            route = route.firstChild;
            const { title, url, style } = route.snapshot.data;
            const { routeConfig } = route.snapshot;
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
    // Object.keys(style).forEach((key: string) => {
    //   document.documentElement.style.setProperty(key, style[key]);
    // });
    document.documentElement.style.backgroundImage = style.background;
  }
}
