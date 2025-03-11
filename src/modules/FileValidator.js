// Класс валидации файла
export class FileValidator {
  // Валидация на максимальный размер
  static validateSize(file, maxSize) {
    return file.size <= maxSize;
  }
}
