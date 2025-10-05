// ========== ПРОСТАЯ ЗАЩИТА ПАРОЛЕМ ==========

class SimpleAuth {
  constructor() {
    this.isAuthenticated = false;
    this.sessionKey = 'budgetAppAuth';
    this.passwordHash = 'simple_password_123'; // Замените на ваш пароль
    
    this.init();
  }
  
  init() {
    // Проверяем, есть ли активная сессия
    const savedAuth = localStorage.getItem(this.sessionKey);
    const now = Date.now();
    
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        // Сессия действует 24 часа
        if (authData.expires > now) {
          this.isAuthenticated = true;
          return;
        } else {
          localStorage.removeItem(this.sessionKey);
        }
      } catch (e) {
        localStorage.removeItem(this.sessionKey);
      }
    }
    
    // Если не авторизован - показываем форму входа
    if (!this.isAuthenticated) {
      this.showLoginForm();
    }
  }
  
  showLoginForm() {
    // Скрываем основное приложение
    const mainContent = document.body;
    mainContent.style.display = 'none';
    
    // Создаем форму входа
    const loginForm = document.createElement('div');
    loginForm.id = 'loginForm';
    loginForm.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    
    loginForm.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 90%;">
        <h2 style="color: #333; margin-bottom: 30px; font-size: 24px;">💰 Наш Семейный Бюджет</h2>
        <p style="color: #666; margin-bottom: 30px;">Введите пароль для доступа к приложению</p>
        
        <input type="password" id="passwordInput" placeholder="Пароль" 
               style="width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; margin-bottom: 20px; box-sizing: border-box;">
        
        <button onclick="simpleAuth.login()" 
                style="width: 100%; padding: 15px; background: #667eea; color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; transition: all 0.3s;">
          Войти
        </button>
        
        <div id="loginError" style="color: #e74c3c; margin-top: 15px; display: none;">
          Неверный пароль
        </div>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Это приложение предназначено только для семейного использования
        </p>
      </div>
    `;
    
    document.body.appendChild(loginForm);
    
    // Фокус на поле пароля
    setTimeout(() => {
      document.getElementById('passwordInput').focus();
    }, 100);
    
    // Обработчик Enter
    document.getElementById('passwordInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.login();
      }
    });
  }
  
  login() {
    const password = document.getElementById('passwordInput').value;
    const errorDiv = document.getElementById('loginError');
    
    // Здесь можно добавить несколько паролей для разных пользователей
    const validPasswords = [
      'budget2024',     // Основной пароль
      'family123',      // Альтернативный
      'ourbudget',      // Простой
      this.passwordHash // Резервный
    ];
    
    if (validPasswords.includes(password)) {
      // Сохраняем авторизацию на 24 часа
      const authData = {
        authenticated: true,
        expires: Date.now() + (24 * 60 * 60 * 1000),
        user: 'family'
      };
      
      localStorage.setItem(this.sessionKey, JSON.stringify(authData));
      this.isAuthenticated = true;
      
      // Убираем форму входа и показываем приложение
      document.getElementById('loginForm').remove();
      document.body.style.display = '';
      
      // Показываем уведомление о входе
      if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.show('💕 Добро пожаловать в ваш семейный бюджет!', 'success');
      } else {
        // Fallback если система уведомлений еще не загружена
        setTimeout(() => {
          if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.show('� Добро пожаловать в ваш семейный бюджет!', 'success');
          }
        }, 2000);
      }
      
    } else {
      errorDiv.style.display = 'block';
      document.getElementById('passwordInput').value = '';
      document.getElementById('passwordInput').focus();
    }
  }
  
  logout() {
    localStorage.removeItem(this.sessionKey);
    this.isAuthenticated = false;
    location.reload();
  }
  
  // Проверка авторизации для других частей приложения
  checkAuth() {
    return this.isAuthenticated;
  }
}

// Инициализация защиты при загрузке страницы
window.simpleAuth = new SimpleAuth();