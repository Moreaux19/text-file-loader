// Класс шкалы загрузки
export class ProgressBar {
  constructor({ progressWrapper, progressFill, progressText, overlay }) {
    this.progressWrapper = progressWrapper;
    this.progressFill = progressFill;
    this.progressText = progressText;
    this.overlay = overlay;

    // Значения для псевдозагрузки
    this.interval = null;
    this.currentPercent = 0;
  }

  // Начало загрузки
  start() {
    this.progressWrapper.style.display = 'block';
    this.progressFill.style.width = '0%';
    this.progressText.textContent = '0%';
    this.overlay.style.display = 'flex';

    const duration = 5000; // Общее время псевдозагрузки
    const refreshTime = 100; // Частота обновлений
    const totalRefreshes = duration / refreshTime;
    const percentBeforeFinish = 90; // Максимальный процент псевдозагрузки
    const increment = percentBeforeFinish / totalRefreshes; // Размер отрезка прогресса

    // Запуск интервальной анимации псевдозагрузки
    this.interval = setInterval(() => {
      if (this.currentPercent < percentBeforeFinish) {
        this.currentPercent += increment;
        this.updateProgress(this.currentPercent);
      }
    }, refreshTime);
  }

  // Обновление процента загрузки
  updateProgress(percent) {
    const roundedPrecent = Math.round(percent);
    this.progressFill.style.width = `${roundedPrecent}%`;
    this.progressText.textContent = `${roundedPrecent}%`;
  }
  // Завершение загрузки
  finish() {
    // Остановка псевдоанимации
    clearInterval(this.interval);
    // Установка финального процента
    this.updateProgress(100);
    this.overlay.style.display = 'none';
    // Скрытие шкалы через секунду после завершения загрузки
    setTimeout(() => {
      this.progressWrapper.style.display = 'none';
      this.progressFill.style.width = '0%';
      this.progressText.textContent = '0%';
    }, 1000);
  }
  // Обработка ошибки
  error() {
    clearInterval(this.interval);
    this.progressText.textContent = 'Ошибка';
    this.progressFill.style.background = 'red';
    this.overlay.style.display = 'none';
    this.progressFill.style.width = '0%';
    this.progressText.textContent = '0%';
  }
}
