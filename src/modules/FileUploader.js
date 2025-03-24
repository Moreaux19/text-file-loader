import { ProgressBar } from './ProgressBar.js';

// Класс отправки файла на сервер
export class FileUploader {
  constructor(file, filename, url, progressElements) {
    this.file = file;
    this.filename = filename;
    this.url = url;
    // Экземпляр класса с анимацией загрузки
    this.handleProgressBar = new ProgressBar(progressElements);
  }

  // Метод для отправки файла на сервер
  upload() {
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
      alert('Error connecting to the server');
      this.handleProgressBar.error();
    };

    // Отправка файла на сервер
    xhr.send(formData);

    // Обработка завершение загрузки
    xhr.onload = () => {
      this.handleProgressBar.finish();
      if (xhr.status === 200) {
        alert('File uploaded successfully');
      } else {
        alert('Error uploading file:', xhr.statusText);
      }
    };
  }
}
