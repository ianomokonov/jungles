import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer-blocks.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent {
  public scrollToTop() {
    window.scroll(0, 0);
  }
}
