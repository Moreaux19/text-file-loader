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

  // Инициализация DOM-элементов внутри Shadow DOM
  initElements() {
    this.dropArea = this.shadowRoot.querySelector('.loader-form__drop-area');
    this.dropAreaText = this.shadowRoot.querySelector('.loader-form__drop-area-text');
    this.fileInput = this.shadowRoot.querySelector('.loader-form__input');
    this.fileNameInput = this.shadowRoot.querySelector('.loader-form__file-name-input');
    this.submitButton = this.shadowRoot.querySelector('.loader-form__submit-button');
    this.progressWrapper = this.shadowRoot.querySelector('.loader-form__progress-wrapper');
    this.progressFill = this.shadowRoot.querySelector('.loader-form__progress-fill');
    this.progressText = this.shadowRoot.querySelector('.loader-form__progress-text');
    this.overlay = this.shadowRoot.querySelector('.loader-form__overlay');
  }

  // Отрисовка HTML-шаблона компонента
  render() {
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href='./src/styles/index.css'/>
        <div class="loader-form">
          <h1 class="loader-form__title">Загрузочное окно</h1>
            <input
              placeholder="Название файла"
              class="loader-form__file-name-input"
              type="text"
              name="name"
              id="name"
              required
            />
          <div class="loader-form__drop-area">
            <img src="./drop-area.svg" />
            <p class="loader-form__drop-area-text">Перенесите ваш файл в область ниже</p>
            <input type="file" class="loader-form__input" accept=".txt,.json,.csv," hidden />
          </div>
          <div class="loader-form__progress-wrapper">
            <div class="loader-form__progress-bar">
              <div class="loader-form__progress-fill"></div>
            </div>
            <div class="loader-form__progress-text">0%</div>
          </div>
          <button class="loader-form__submit-button" disabled>Загрузить</button>
        </div>
        <div class="overlay"></div>
      `;
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
    this.fileNameInput.addEventListener('input', () => {
      this.isInputFilled = this.fileNameInput.value.length > 0;
      this.setButtonActive();
    });

    // Открытие окна выбора файла по клику на drop-зону
    this.dropArea.addEventListener('click', () => {
      this.fileInput.click();
    });

    // Обработка нажатия кнопки загрущки файла
    this.submitButton.addEventListener('click', () => {
      // Формирование объекта с элементами прогресс-бара
      const progressElements = {
        progressWrapper: this.progressWrapper,
        progressFill: this.progressFill,
        progressText: this.progressText,
        overlay: this.overlay
      };

      // Создание экземпляра загрузчика и передача параметров
      const uploader = new FileUploader(
        this.selectedFile,
        this.fileNameInput,
        this.url,
        progressElements
      );

      // Запуск загрузки
      uploader.upload();

      // Очистка поля ввода имени файла
      this.fileNameInput.value = '';
      // Деактивация кнопки загрузки файла
      this.submitButton.disabled = true;
    });
  }

  // Активация кнопки загрузки файла
  setButtonActive() {
    this.submitButton.disabled = !(this.isInputFilled && this.isFileSelected);
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
}

// Регистрация компонента в Custom Elements
customElements.define('loader-form', LoaderForm);
