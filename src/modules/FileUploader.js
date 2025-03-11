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
    console.log(this.file);

    // Создание объекта XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.url);

    // Запуск отображения прогресса
    this.handleProgressBar.start();

    // Отслеживание и отображение загрузки файла
    // xhr.upload.addEventListener('progress', event => {
    //   const percent = Math.round((event.loaded / event.total) * 100);
    //   this.handleProgressBar.updateProgress(percent);
    // });

    // Обработка завершение загрузки
    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('File uploaded successfully');
      } else {
        console.error('Error uploading file:', xhr.statusText);
      }
      this.handleProgressBar.finish();
    };

    // Обработка ошибки при загрузке
    xhr.onerror = () => {
      console.error('Error connecting to the server');
      this.handleProgressBar.error();
    };

    // Отправка файла на сервер
    xhr.send(formData);
  }
}
