import { ProgressBar } from './ProgressBar';

// Описание элементов, передаваемых в ProgressBar
interface ProgressElements {
  progressWrapper: HTMLDivElement;
  progressFill: HTMLDivElement;
  progressText: HTMLDivElement;
  overlay: HTMLDivElement;
  resetFunction: () => void;
}

// Класс отправки файла на сервер
export class FileUploader {
  private file: File;
  private filename: string;
  private url: string;
  private handleProgressBar: ProgressBar;

  constructor(file: File, filename: string, url: string, progressElements: ProgressElements) {
    this.file = file;
    this.filename = filename;
    this.url = url;
    this.handleProgressBar = new ProgressBar(progressElements);
  }
  // Метод для отправки файла на сервер
  upload(): void {
    // Создание экземпляра FormData
    const formData = new FormData();
    // Добавляение файла
    formData.append('file', this.file);
    // Добавление названия файла
    formData.append('name', this.filename);

    // Создание объекта XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.url);

    // Запуск отображения прогресса
    this.handleProgressBar.start();

    // Обработка ошибки при загрузке
    xhr.onerror = () => {
      alert('Ошибка сети при загрузке файла.');

      this.handleProgressBar.error();
    };

    // Отправка файла на сервер
    xhr.send(formData);

    // Обработка завершение загрузки
    xhr.onload = () => {
      this.handleProgressBar.finish(xhr);
    };
  }
}
