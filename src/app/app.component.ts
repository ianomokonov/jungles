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

  constructor(private routee: ActivatedRoute, private router: Router) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.routee),
        map((route: ActivatedRoute) => {
          const routes: { title: string; url: string }[] = [];
          while (route.firstChild) {
            // eslint-disable-next-line no-param-reassign
            route = route.firstChild;
            const { title } = route.snapshot.data;
            const { routeConfig } = route.snapshot;
            if (title && routeConfig?.path) {
              routes.push({
                title,
                url: `${routes.map((r) => r.url).join('/')}/${routeConfig.path}`,
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
}
