import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/backend/task.service';

@Component({
  selector: 'app-remove-task',
  templateUrl: './remove-task.component.html',
  styleUrls: ['./remove-task.component.less'],
})
export class RemoveTaskComponent implements OnInit {
  public tasks;
  public taskIdControl = new FormControl(null, Validators.required);
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getShortTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  public onDeleteTask() {
    if (this.taskIdControl.invalid) {
      this.taskIdControl.markAsTouched();
      return;
    }

    this.taskService.deleteTask(this.taskIdControl.value).subscribe(() => {
      alert('Упражнение удалено');
      this.taskIdControl.reset();
      this.ngOnInit();
    });
  }
}
