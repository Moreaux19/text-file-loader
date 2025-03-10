import { FileValidator } from './FileValidator';
import { FileUploader } from './FileUploader';

class LoaderForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isFileSelected = false;
    this.isInputFilled = false;
    this.selectedFile = null;
    this.FILE_MAX_SIZE = 1024;
    this.url = 'https://file-upload-server-mc26.onrender.com/api/v1/upload';
  }

  connectedCallback() {
    this.render();
    this.initElements();
    this.addEventListeners();
  }

  initElements() {
    this.dropArea = this.shadowRoot.querySelector('.loader-form__drop-area');
    this.dropAreaText = this.shadowRoot.querySelector('.loader-form__drop-area-text');
    this.fileInput = this.shadowRoot.querySelector('.loader-form__input');
    this.fileNameInput = this.shadowRoot.querySelector('.loader-form__file-name-input');
    this.submitButton = this.shadowRoot.querySelector('.loader-form__submit-button');
    // убрать
    this.progressWrapper = this.shadowRoot.querySelector('.loader-form__progress-wrapper');
    this.progressFill = this.shadowRoot.querySelector('.loader-form__progress-fill');
    this.progressText = this.shadowRoot.querySelector('.loader-form__progress-text');
    this.overlay = this.shadowRoot.querySelector('.loader-form__overlay');
  }

  render() {
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href='/src/style.css'/>
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
            <img src="/drop-area.svg" />
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
        <div class="loader-form__overlay"></div>
      `;
  }

  addEventListeners() {
    this.dropArea.addEventListener('dragover', event => {
      event.preventDefault();
    });

    this.dropArea.addEventListener('drop', event => {
      event.preventDefault();
      this.handleFilePick(event);
    });

    this.fileInput.addEventListener('change', event => {
      this.handleFilePick(event);
    });

    this.fileNameInput.addEventListener('input', () => {
      this.isInputFilled = this.fileNameInput.value.length > 0;
      this.setButtonActive();
    });

    this.dropArea.addEventListener('click', () => {
      this.fileInput.click();
    });

    this.submitButton.addEventListener('click', () => {
      const progressElements = {
        progressWrapper: this.progressWrapper,
        progressFill: this.progressFill,
        progressText: this.progressText,
        overlay: this.overlay
      };
      const uploader = new FileUploader(
        this.selectedFile,
        this.fileNameInput,
        this.url,
        progressElements
      );
      uploader.upload();
      this.fileNameInput.value = '';
    });
  }

  setButtonActive() {
    this.submitButton.disabled = !(this.isInputFilled && this.isFileSelected);
  }

  handleFilePick(event) {
    const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];

    if (!file) return;
    if (!FileValidator.validateSize(file, this.FILE_MAX_SIZE)) {
      alert('Размер файла не должен превышать 1024 байта');
      return;
    }
    this.selectedFile = file;
    this.isFileSelected = true;
    this.setButtonActive();
  }
}

customElements.define('loader-form', LoaderForm);
