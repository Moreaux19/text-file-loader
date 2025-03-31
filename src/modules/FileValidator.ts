// Класс валидации файла
export class FileValidator {
  // Валидация на максимальный размер
  static validateSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }
  // Валидация на допустимый формат
  static validateType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }
  // Объединённый метод валидации
  static validate(file: File, maxSize: number, allowedTypes: string[]): string | null {
    if (!this.validateSize(file, maxSize)) alert('xxxxРазмер файла не должен превышать 1024 байта');
    if (!this.validateType(file, allowedTypes))
      alert('Недопустимый формат файла - тип файла должен быть: txt, json или csv');
    return null;
  }
}
