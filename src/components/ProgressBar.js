// Класс шкалы загрузки
export class ProgressBar {
  constructor({ progressWrapper, progressFill, progressText, overlay }) {
    this.progressWrapper = progressWrapper;
    this.progressFill = progressFill;
    this.progressText = progressText;
    this.overlay = overlay;
  }

  // Начало загрузки
  start() {
    this.progressWrapper.style.display = 'block';
    this.progressFill.style.width = '0%';
    this.progressText.textContent = '0%';
    this.overlay.style.display = 'flex';
  }

  // Обновление процента загрузки
  updateProgress(percent) {
    this.progressFill.style.width = `${percent}%`;
    this.progressText.textContent = `${percent}%`;
  }
  // Завершение загрузки
  finish() {
    this.overlay.style.display = 'none';
  }
  // Обработка ошибки
  error() {
    this.progressText.textContent = 'Ошибка';
    this.progressFill.style.background = 'red';
    this.overlay.style.display = 'none';
  }
}
