import { NgModule } from '@angular/core';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';

@NgModule({
  declarations: [ProjectComponent],
  imports: [ProjectRoutingModule],
})
export class ProjectModule {}
