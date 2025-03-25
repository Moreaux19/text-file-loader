// Класс валидации файла
export class FileValidator {
  // Валидация на максимальный размер
  static validateSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }
}
