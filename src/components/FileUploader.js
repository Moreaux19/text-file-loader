import { ProgressBar } from './ProgressBar.js';

// Класс отправки файла на сервер
export class FileUploader {
  constructor(file, filename, url, progressElements) {
    this.file = file;
    this.filename = filename;
    this.url = url;
    this.handleProgressBar = new ProgressBar(progressElements);
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('name', this.filename);
    console.log(this.file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.url);
    this.handleProgressBar.start();
    xhr.upload.addEventListener('progress', event => {
      const percent = Math.round((event.loaded / event.total) * 100);
      this.handleProgressBar.updateProgress(percent);
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('File uploaded successfully');
      } else {
        console.error('Error uploading file:', xhr.statusText);
      }
      this.handleProgressBar.finish();
    };

    xhr.onerror = () => {
      console.error('Error connecting to the server');
      this.handleProgressBar.error();
    };

    xhr.send(formData);
  }
}
