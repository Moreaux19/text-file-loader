const dropArea = document.querySelector('.loader-form__drop-area');
const dropAreaText = document.querySelector('.loader-form__drop-area-text');
const fileInput = document.querySelector('.loader-form__input');
const fileNameInput = document.querySelector('.loader-form__file-name');
const loadButton = document.querySelector('.loader-form__button');
const progressWrapper = document.querySelector('.loader-form__progress-wrapper');
const progressFill = document.querySelector('.loader-form__progress-fill');
const progressText = document.querySelector('.loader-form__progress-text');
const blockOverlay = document.querySelector('.block-overlay');

const FILE_MAX_SIZE = 1024;
let isFileSelected = false;
let isInputFilled = false;
let selectedFile;
let uploadedFile;
let adress = 'https://file-upload-server-mc26.onrender.com/api/v1/upload';

function setButtonActive() {
  loadButton.disabled = !(isInputFilled && isFileSelected);
}

function validateFileSize(file) {
  return file.size <= FILE_MAX_SIZE;
}

function handleFilePick(event) {
  event.preventDefault();
  const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];

  if (!file) return;
  if (!validateFileSize(file)) {
    alert('Размер файла не должен превышать 1024 байта');
    return;
  }
  selectedFile = file;
}

function handleFileUpload(file, url) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', fileNameInput.value);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  handleProgressBar(xhr);
  xhr.send(formData);
}

function handleProgressBar(xhr) {
  progressWrapper.style.display = 'block';
  progressFill.style.width = '0%';
  progressText.textContent = '0%';

  blockOverlay.style.display = 'flex';

  xhr.upload.addEventListener('progress', event => {
    const progress = Math.round((event.loaded / event.total) * 100);
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;
  });

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      console.log(response);

      dropAreaText.textContent = 'Файл загружен';
    } else {
      dropAreaText.textContent = 'Ошибка загрузки файла';
    }
    blockOverlay.style.display = 'none';
  };
  xhr.onerror = () => {
    dropAreaText.textContent = 'Ошибка соединения';
    progressText.textContent = 'Ошибка';
    progressFill.style.background = 'red';
  };
}

dropArea.addEventListener('dragover', event => {
  event.preventDefault();
});

dropArea.addEventListener('drop', event => {
  event.preventDefault();
  if (event.dataTransfer.items[0].kind !== 'file') {
    dropAreaText.textContent = 'Только файлы могут быть загружены';
    return;
  }
  if (event.dataTransfer.items.length > 1) {
    dropAreaText.textContent = 'Можно загрузить только один файл за раз';
    return;
  }
  handleFilePick(event);
  isFileSelected = true;
  setButtonActive();
});

fileInput.addEventListener('change', event => {
  isFileSelected = event.target.files.length > 0;
  setButtonActive();
  handleFilePick(event);
});

fileNameInput.addEventListener('input', () => {
  isInputFilled = fileNameInput.value.length > 0;
  setButtonActive();
});

dropArea.addEventListener('click', event => {
  fileInput.click();
});

loadButton.addEventListener('click', () => {
  handleFileUpload(selectedFile, adress);
  fileNameInput.value = '';
});
