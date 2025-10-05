// ========== УПРОЩЕННАЯ ЗАЩИТА ==========

class SimpleProtection {
  constructor() {
    this.isProtected = false; // Выключаем защиту по умолчанию
    this.init();
  }
  
  init() {
    // Если нужна защита - можно включить
    if (this.isProtected) {
      this.checkAccess();
    }
    
    // Показываем приветствие
    setTimeout(() => {
      if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.show('💕 Добро пожаловать в семейный бюджет!', 'success');
      }
    }, 2000);
  }
  
  // Включить защиту (если понадобится)
  enableProtection() {
    this.isProtected = true;
    localStorage.setItem('protectionEnabled', 'true');
    this.checkAccess();
  }
  
  // Выключить защиту
  disableProtection() {
    this.isProtected = false;
    localStorage.removeItem('protectionEnabled');
    localStorage.removeItem('budgetAppAuth');
  }
  
  checkAccess() {
    // Простая проверка - можно расширить при необходимости
    const hasAccess = localStorage.getItem('budgetAppAuth');
    if (!hasAccess) {
      const password = prompt('Введите пароль для доступа к бюджету:');
      if (password === 'family2024') {
        localStorage.setItem('budgetAppAuth', 'true');
        if (typeof window.notificationSystem !== 'undefined') {
          window.notificationSystem.show('✅ Доступ разрешен', 'success');
        }
      } else if (password !== null) {
        alert('Неверный пароль');
        this.checkAccess();
      }
    }
  }
}

// Инициализация простой защиты
window.simpleProtection = new SimpleProtection();