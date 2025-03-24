import { FileValidator } from './modules/FileValidator';
import { FileUploader } from './modules/FileUploader';

// Веб-компонент загрузочной формы
class LoaderForm extends HTMLElement {
  constructor() {
    super();
    // Создание Shadow DOM
    this.attachShadow({ mode: 'open' });
    // Инициализация состояний
    this.isFileSelected = false; // Файл выбран
    this.isInputFilled = false; // Поле названия заполнено
    this.selectedFile = null; // Хранение выбранного файла
    // Максимальный размер файла в байтах
    this.FILE_MAX_SIZE = 1024;
    // URL сервера для загрузки
    this.url = 'https://file-upload-server-mc26.onrender.com/api/v1/upload';
  }

  // Хук жизненного цикла компонента
  connectedCallback() {
    this.render(); // Отрисовка шаблона
    this.initElements(); // Инициализация DOM-элементов
    this.addEventListeners(); // Назначение обработчиков событий
  }

  // Отрисовка HTML-шаблона компонента
  render() {
    this.shadowRoot.innerHTML = `
          <link rel="stylesheet" href='./src/styles/index.css'/>
  
          <div class="loader-form-wrapper">
            <div class="loader-form">
            <button class="loader-form__close-button">
              <div class="cross"></div>
            </button>
            <h1 class="loader-form__title">Загрузочное окно</h1>
            <p class='loader-form__subtitle'>Перед загрузкой дайте имя файлу</p>
            <div class='loader-form__filename-wrapper'>
              <input
                placeholder="Название файла"
                class="loader-form__filename-input"
                type="text"
                name="name"
                id="name"
                required
            />
            <div class='loader-form__filename-clear-button cross_input'></div>
            </div>
            <div class="loader-form__drop-area">
              <img src="./drop-area.svg" />
              <p class="loader-form__drop-area-text">Перенесите ваш файл в область ниже</p>
              <input type="file" class="loader-form__input" accept=".txt,.json,.csv," hidden />
            </div>
            <div class="loader-form__progress-wrapper">
              <div class="loader-form__progress-icon"></div>
              <div class="loader-form__progress-bar-section">
                <div class="loader-form__progress-filename">file</div>
                <div class="loader-form__progress-percent">0%</div>
                <div class="loader-form__progress-bar"></div>
                <div class="loader-form__progress-fill"></div>      
              </div>
              <div class="loader-form__clear-file-button cross_input top-alt color-accent"></div>
            </div>
          <button class="loader-form__submit-button loader-form__submit-button--inactive" disabled>Загрузить</button>
          </div>
          <div class="overlay"></div>
          </div>
        `;
  }

  // Инициализация DOM-элементов внутри Shadow DOM
  initElements() {
    this.dropArea = this.shadowRoot.querySelector('.loader-form__drop-area');
    this.fileInput = this.shadowRoot.querySelector('.loader-form__input');
    this.filenameInput = this.shadowRoot.querySelector('.loader-form__filename-input');
    this.clearFilenameButton = this.shadowRoot.querySelector(
      '.loader-form__filename-clear-button '
    );
    this.submitButton = this.shadowRoot.querySelector('.loader-form__submit-button');
    this.progressFill = this.shadowRoot.querySelector('.loader-form__progress-fill');
    this.progressPercent = this.shadowRoot.querySelector('.loader-form__progress-percent');
    this.progressFilename = this.shadowRoot.querySelector('.loader-form__progress-filename');
    this.progressWrapper = this.shadowRoot.querySelector('.loader-form__progress-wrapper');
    this.clearFileButton = this.shadowRoot.querySelector('.loader-form__clear-file-button');
    this.overlay = this.shadowRoot.querySelector('.overlay');
  }

  // Назначение всех обработчиков событий
  addEventListeners() {
    // Разрешение события dragover
    this.dropArea.addEventListener('dragover', event => {
      event.preventDefault();
    });

    // Обработка события "перетаскивания и отпускания файла"
    this.dropArea.addEventListener('drop', event => {
      event.preventDefault();
      this.handleFilePick(event);
    });

    // Обработка выбора файла через иконку
    this.fileInput.addEventListener('change', event => {
      this.handleFilePick(event);
    });

    // Отслеживание ввода имени файла
    this.filenameInput.addEventListener('input', () => {
      this.isInputFilled = this.filenameInput.value.length > 0;
      this.setButtonActive();
    });

    // Обработка очистки поля ввода имени файла
    this.clearFilenameButton.addEventListener('click', () => {
      this.filenameInput.value = '';
      this.isInputFilled = false;
      this.showFileIcon(this.isInputFilled);
    });

    // Открытие окна выбора файла по клику на drop-зону
    this.dropArea.addEventListener('click', () => {
      this.fileInput.click();
    });

    // Обработка нажатия кнопки удаления файла
    this.clearFileButton.addEventListener('click', () => {
      this.selectedFile = null;
      this.resetForm();
    });

    // Обработка нажатия кнопки загрущки файла
    this.submitButton.addEventListener('click', () => {
      // Формирование объекта с элементами прогресс-бара
      const progressElements = {
        progressWrapper: this.progressWrapper,
        progressFill: this.progressFill,
        progressText: this.progressPercent,
        overlay: this.overlay,
        resetFunction: this.resetForm.bind(this)
      };

      // Создание экземпляра загрузчика и передача параметров
      const uploader = new FileUploader(
        this.selectedFile,
        this.filenameInput,
        this.url,
        progressElements
      );

      // Запуск загрузки
      uploader.upload();
    });
  }

  // Обработка выбора файла
  handleFilePick(event) {
    // Проверка метода добавления файла и назначение файла в переменную
    const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];

    if (!file) return;

    // Проверка размера файла
    if (!FileValidator.validateSize(file, this.FILE_MAX_SIZE)) {
      alert('Размер файла не должен превышать 1024 байта');
      return;
    }

    // Сохранение выбранного файла и обновление состояния
    this.selectedFile = file;
    this.isFileSelected = true;
    this.setButtonActive();
  }

  // Активация кнопки загрузки файла
  setButtonActive() {
    // Проверка на наличие файла и его названия
    const isActive = this.isInputFilled && this.isFileSelected;
    this.submitButton.disabled = !isActive;
    // Активируем кнопку при соблюдении условий
    this.toggleButtonStyle(isActive);
    // Отображаем иконку файлу с его названием
    this.showFileIcon(isActive);
  }

  // Активация кнопки при соблюдении условий
  toggleButtonStyle(active) {
    if (active) {
      this.submitButton.classList.remove('loader-form__submit-button--inactive');
      this.submitButton.classList.add('loader-form__submit-button--active');
    } else {
      this.submitButton.classList.remove('loader-form__submit-button--active');
      this.submitButton.classList.add('loader-form__submit-button--inactive');
    }
  }

  // Отображение иконки файла при соблюдении условий
  showFileIcon(show) {
    if (show) {
      // Отображение прогресс-бара
      this.progressWrapper.style.display = 'flex';
      // Отображение имени файла в прогресс-баре
      const extension = this.selectedFile ? '.' + this.selectedFile.name.split('.').pop() : '';
      this.progressFilename.textContent = this.filenameInput.value + extension;
    } else {
      this.progressFilename.textContent = '';
      this.progressWrapper.style.display = 'none';
    }
  }

  // Сброс состояний кнопки и инпута
  resetForm() {
    this.filenameInput.value = '';
    this.isInputFilled = false;
    this.isFileSelected = false;
    this.selectedFile = null;
    this.setButtonActive();
  }
}

// Регистрация компонента в Custom Elements
customElements.define('loader-form', LoaderForm);
