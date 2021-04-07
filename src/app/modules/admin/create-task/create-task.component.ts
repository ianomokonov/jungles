import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Answer } from 'src/app/models/answer';
import { TaskQuestion } from 'src/app/models/task-question';
import { TaskType } from 'src/app/models/task-type.enum';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.less'],
})
export class CreateTaskComponent implements OnInit {
  public taskForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      type: [null, Validators.required],
      questions: this.fb.array([]),
    });
  }

  public addQuestion() {
    const questions = this.taskForm.get('questions') as FormArray;
    questions.push(this.getQuestionForm({ name: 'Вопрос' } as TaskQuestion));
  }

  private getQuestionForm(question: TaskQuestion): FormGroup {
    const formGroup = this.fb.group({
      id: question.id,
      name: question.name,
      taskId: question.taskId,
      cristalsCount: question.cristalsCount,
      image: question.image,
      answers: this.fb.array([]),
    });
    return formGroup;
  }

  public get questions(): FormGroup[] {
    return (this.taskForm.get('questions') as FormArray).controls as FormGroup[];
  }

  public addAnswer(question: FormGroup) {
    (question.get('answers') as FormArray).push(this.fb.group({ name: 'Ответ' } as Answer));
  }

  public get taskTypes() {
    const result = [];
    Object.keys(TaskType).forEach((key) => {
      if (Number.isNaN(+TaskType[key])) {
        result.push({
          name: TaskType[key],
        });
      }
    });
    console.log(Object.keys(TaskType));
    return result;
  }
}
