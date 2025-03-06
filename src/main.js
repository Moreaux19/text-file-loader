const dropArea = document.querySelector('.loader-form__drop-area');
const dropAreaText = document.querySelector('.loader-form__drop-area-text');
const fileInput = document.querySelector('.loader-form__input');
const fileNameInput = document.querySelector('.loader-form__file-name');
const loadButton = document.querySelector('.loader-form__button');
const MAX_FILE_SIZE = 1024;
let uploadedFile;

function validateFileType(file) {
  return ['text/plain', 'application/json', 'text/csv'].includes(file.type);
}

function validateFileSize(file) {
  return file.size <= MAX_FILE_SIZE;
}

function handleFileSelect(event) {
  const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
  if (!file) return;
  if (!validateFileSize(file)) {
    alert('Размер файла не должен превышать 1024 байта');
    return;
  }
  if (!validateFileType(file)) {
    alert('Разрешены только файлы .txt, .json, .csv');
    return;
  }
  let fileName = fileNameInput.value;
  if (fileName.length >= 1) {
    console.log(`${fileName} :`, file);
  } else {
    console.log(`${file.name} :`, file);
  }
  fileNameInput.value = '';
}

dropArea.addEventListener('dragover', event => {
  event.preventDefault();
});

dropArea.addEventListener('drop', event => {
  event.preventDefault();
  if (event.dataTransfer.items[0].kind !== 'file') {
    dropAreaText.textContent = 'Только файлы могут быть загружены';
  }
  if (event.dataTransfer.items.length > 1) {
    dropAreaText.textContent = 'Можно загрузить только один файл за раз';
  }
  if (event.dataTransfer.files.length) {
    handleFileSelect(event);
  }
});

fileInput.addEventListener('change', event => {
  handleFileSelect(event);
  fileInput.value = ''; // Сброс значения инпут, чтобы один и тот же файл можно было загружать несколько раз
});

loadButton.addEventListener('click', () => {
  fileInput.click();
});
