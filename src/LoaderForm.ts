import { FileValidator } from './modules/FileValidator';
import { FileUploader } from './modules/FileUploader';
import css from './styles/index.css';
// Интерфейс элементов прогресс-бара
interface ProgressElements {
  progressWrapper: HTMLDivElement; // Контейнер, оборачивающий прогресс-бар
  progressFill: HTMLDivElement; // Элемент, отображающий заполнение прогресс-бара
  progressText: HTMLDivElement; // Текстовый элемент, показывающий процент загрузки
  overlay: HTMLDivElement; // Затемняющий фон, показывающий, что процесс идёт
  resetFunction: () => void; // Функция, не принимающая аргументов и ничего не возвращающая
}

// Веб-компонент загрузочной формы
class LoaderForm extends HTMLElement {
  // Инициализация состояний
  private isFileSelected: boolean = false; // Файл выбран
  private isInputFilled: boolean = false; // Поле названия заполнено
  private selectedFile: File | null = null; // Хранение выбранного файла
  private readonly FILE_MAX_SIZE: number = 1024; // Максимальный размер файла в байтах
  private readonly url: string = 'https://file-upload-server-mc26.onrender.com/api/v1/upload'; // URL сервера для загрузки

  // Элементы формы (определены позже в initElements)
  private dropArea!: HTMLDivElement;
  private fileInput!: HTMLInputElement;
  private filenameInput!: HTMLInputElement;
  private clearFilenameButton!: HTMLDivElement;
  private submitButton!: HTMLButtonElement;
  private progressFill!: HTMLDivElement;
  private progressPercent!: HTMLDivElement;
  private progressFilename!: HTMLDivElement;
  private progressWrapper!: HTMLDivElement;
  private clearFileButton!: HTMLDivElement;
  private overlay!: HTMLDivElement;

  constructor() {
    super();
    // Создание Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });

    // Добавление стилей
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('./styles/index.css', import.meta.url).pathname;
    shadow.appendChild(link);
    // const style = document.createElement('style');
    // style.textContent = css;
    // shadow.appendChild(style);

    // Создание контейнера для контента
    const container = document.createElement('div');
    container.classList.add('loader-form-container');
    shadow.appendChild(container);
  }

  // Хук жизненного цикла компонента
  connectedCallback(): void {
    this.render(); // Отрисовка шаблона
    this.initElements(); // Инициализация DOM-элементов
    this.addEventListeners(); // Назначение обработчиков событий
  }

  // Отрисовка HTML-шаблона компонента
  render(): void {
    const container = this.shadowRoot!.querySelector('.loader-form-container');
    if (!container) return;
    container.innerHTML = `

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
  initElements(): void {
    this.dropArea = this.shadowRoot!.querySelector('.loader-form__drop-area')!;
    this.fileInput = this.shadowRoot!.querySelector('.loader-form__input')!;
    this.filenameInput = this.shadowRoot!.querySelector('.loader-form__filename-input')!;
    this.clearFilenameButton = this.shadowRoot!.querySelector(
      '.loader-form__filename-clear-button'
    )!;
    this.submitButton = this.shadowRoot!.querySelector('.loader-form__submit-button')!;
    this.progressFill = this.shadowRoot!.querySelector('.loader-form__progress-fill')!;
    this.progressPercent = this.shadowRoot!.querySelector('.loader-form__progress-percent')!;
    this.progressFilename = this.shadowRoot!.querySelector('.loader-form__progress-filename')!;
    this.progressWrapper = this.shadowRoot!.querySelector('.loader-form__progress-wrapper')!;
    this.clearFileButton = this.shadowRoot!.querySelector('.loader-form__clear-file-button')!;
    this.overlay = this.shadowRoot!.querySelector('.overlay')!;
  }

  // Назначение всех обработчиков событий
  addEventListeners(): void {
    // Разрешение события dragover
    this.dropArea.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault();
    });

    // Обработка события "перетаскивания и отпускания файла"
    this.dropArea.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault();
      this.handleFilePick(event);
    });

    // Обработка выбора файла через иконку
    this.fileInput.addEventListener('change', (event: Event) => {
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
      const progressElements: ProgressElements = {
        progressWrapper: this.progressWrapper,
        progressFill: this.progressFill,
        progressText: this.progressPercent,
        overlay: this.overlay,
        resetFunction: this.resetForm.bind(this)
      };

      if (this.selectedFile) {
        // Создание экземпляра загрузчика и передача параметров
        const uploader = new FileUploader(
          this.selectedFile,
          this.filenameInput.value,
          this.url,
          progressElements
        );

        // Запуск загрузки
        uploader.upload();
      }
    });
  }

  // Обработка выбора файла
  handleFilePick(event: Event): void {
    // Проверка метода добавления файла и назначение файла в переменную
    let file: File | null = null;

    if (event instanceof DragEvent && event.dataTransfer?.files?.length) {
      file = event.dataTransfer.files[0];
    } else if (event.target instanceof HTMLInputElement && event.target.files?.length) {
      file = event.target.files[0];
    }

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
  setButtonActive(): void {
    // Проверка на наличие файла и его названия
    const isActive: boolean = this.isInputFilled && this.isFileSelected;
    this.submitButton.disabled = !isActive;
    // Активируем кнопку при соблюдении условий
    this.toggleButtonStyle(isActive);
    // Отображаем иконку файлу с его названием
    this.showFileIcon(isActive);
  }

  // Активация кнопки при соблюдении условий
  toggleButtonStyle(active: boolean): void {
    if (active) {
      this.submitButton.classList.remove('loader-form__submit-button--inactive');
      this.submitButton.classList.add('loader-form__submit-button--active');
    } else {
      this.submitButton.classList.remove('loader-form__submit-button--active');
      this.submitButton.classList.add('loader-form__submit-button--inactive');
    }
  }

  // Отображение иконки файла при соблюдении условий
  showFileIcon(show: boolean): void {
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
  resetForm(): void {
    this.filenameInput.value = '';
    this.isInputFilled = false;
    this.isFileSelected = false;
    this.selectedFile = null;
    this.setButtonActive();
  }
}

// Регистрация компонента в Custom Elements
customElements.define('loader-form', LoaderForm);
