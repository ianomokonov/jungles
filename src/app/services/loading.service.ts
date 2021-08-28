import { ChangeDetectorRef, EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable()
export class LoadingService {
  /** отображать возможность отмены */
  public hasCancelBtn = true;
  /** срабатывает при отмене загрузки */
  public onCancel: EventEmitter<boolean> = new EventEmitter();
  /** cdRef */
  private cdRef: ChangeDetectorRef;
  /** get isLoading */
  public get isLoading(): boolean {
    return this.isLoadingPrivate;
  }
  /** идет загрузка */
  private isLoadingPrivate: boolean;
  /** текущие подписки приложения */
  private subscriptions: Subscription = new Subscription();
  /** количество активных подписок */
  private subscriptionsCount = 0;
  /** установить отображение кнопки отмены по умолчанию */
  public setDefaultCancelBtn(): void {
    this.hasCancelBtn = true;
  }
  /** установить отображение кнопки отмены по умолчанию */
  public set changeDetectorRef(cdr: ChangeDetectorRef) {
    this.cdRef = cdr;
  }
  /** отменить текущие загрузки */
  public cancelLoading(): void {
    if (!this.hasCancelBtn) {
      return;
    }
    this.subscriptions.unsubscribe();
    this.isLoadingPrivate = false;
    this.setDefaultCancelBtn();
    this.subscriptions = new Subscription();
    this.subscriptionsCount = 0;
  }
  /** добавление подписки */
  public addSubscription(subscription: Subscription): void {
    this.subscriptionsCount += 1;
    this.subscriptions.add(subscription);
    this.isLoadingPrivate = true;
    this.cdRef.detectChanges();
  }
  /** удаление подписки */
  public removeSubscription(subscription: Subscription): void {
    if (this.subscriptionsCount > 0) {
      this.subscriptionsCount -= 1;
    }

    this.subscriptions.remove(subscription);
    if (this.subscriptionsCount === 0) {
      this.isLoadingPrivate = false;
      this.cdRef.detectChanges();
    }
  }
}
