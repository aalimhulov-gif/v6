// ========== ПЕРСОНАЛЬНЫЕ УЛУЧШЕНИЯ ==========

class PersonalFeatures {
  constructor() {
    this.init();
  }
  
  init() {
    // Добавляем быстрые кнопки для часто используемых операций
    this.addQuickActions();
    
    // Улучшаем интерфейс личными штучками
    this.addPersonalTouches();
    
    // Добавляем умные подсказки
    this.addSmartSuggestions();
  }
  
  addQuickActions() {
    document.addEventListener('DOMContentLoaded', () => {
      // Добавляем плавающие быстрые кнопки
      this.createFloatingButtons();
      
      // Добавляем горячие клавиши
      this.setupHotkeys();
    });
  }
  
  createFloatingButtons() {
    const floatingPanel = document.createElement('div');
    floatingPanel.id = 'floatingPanel';
    floatingPanel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
      transition: all 0.3s ease;
    `;
    
    // Кнопка быстрого добавления дохода
    const quickIncomeBtn = this.createQuickButton('💰', '#4CAF50', () => {
      this.quickAddIncome();
    }, 'Быстро добавить доход (Ctrl+1)');
    
    // Кнопка быстрого добавления расхода
    const quickExpenseBtn = this.createQuickButton('💸', '#f44336', () => {
      this.quickAddExpense();
    }, 'Быстро добавить расход (Ctrl+2)');
    
    // Кнопка быстрого просмотра баланса
    const quickBalanceBtn = this.createQuickButton('📊', '#2196F3', () => {
      this.showQuickBalance();
    }, 'Показать баланс (Ctrl+B)');
    
    floatingPanel.appendChild(quickIncomeBtn);
    floatingPanel.appendChild(quickExpenseBtn);
    floatingPanel.appendChild(quickBalanceBtn);
    
    document.body.appendChild(floatingPanel);
    
    // Скрываем панель на мобильных, если открыто меню
    this.setupFloatingPanelBehavior(floatingPanel);
  }
  
  createQuickButton(emoji, color, onClick, title) {
    const btn = document.createElement('button');
    btn.innerHTML = emoji;
    btn.title = title;
    btn.style.cssText = `
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: ${color};
      color: white;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    btn.onmouseenter = () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
    };
    
    btn.onmouseleave = () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    };
    
    btn.onclick = onClick;
    
    return btn;
  }
  
  setupFloatingPanelBehavior(panel) {
    // Скрываем панель если экран узкий или открыто меню
    const checkVisibility = () => {
      const burgerMenu = document.getElementById('burgerMenu');
      const isMenuOpen = burgerMenu && burgerMenu.style.display !== 'none';
      const isNarrow = window.innerWidth < 768;
      
      if (isMenuOpen || isNarrow) {
        panel.style.opacity = '0';
        panel.style.pointerEvents = 'none';
      } else {
        panel.style.opacity = '1';
        panel.style.pointerEvents = 'auto';
      }
    };
    
    window.addEventListener('resize', checkVisibility);
    
    // Проверяем каждые 500мс
    setInterval(checkVisibility, 500);
  }
  
  setupHotkeys() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            this.quickAddIncome();
            break;
          case '2':
            e.preventDefault();
            this.quickAddExpense();
            break;
          case 'b':
          case 'B':
            e.preventDefault();
            this.showQuickBalance();
            break;
        }
      }
    });
  }
  
  quickAddIncome() {
    const amount = prompt('💰 Быстрое добавление дохода:\n\nВведите сумму (например: 1000):');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const description = prompt('📝 Описание дохода:') || 'Быстрый доход';
      
      // Добавляем транзакцию
      this.addQuickTransaction(parseFloat(amount), 'income', description);
      
      if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.show(`✅ Добавлен доход: +${amount} zł`, 'success');
      }
    }
  }
  
  quickAddExpense() {
    const amount = prompt('💸 Быстрое добавление расхода:\n\nВведите сумму (например: 500):');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const description = prompt('📝 Описание расхода:') || 'Быстрый расход';
      
      // Добавляем транзакцию
      this.addQuickTransaction(-parseFloat(amount), 'expense', description);
      
      if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.show(`✅ Добавлен расход: -${amount} zł`, 'success');
      }
    }
  }
  
  addQuickTransaction(amount, type, description) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      const newTransaction = {
        id: Date.now() + Math.random(),
        amount: amount,
        type: type,
        description: description,
        category: type === 'income' ? 'Доходы' : 'Разное',
        date: new Date().toISOString().split('T')[0],
        person: 'Семья',
        timestamp: new Date().toISOString()
      };
      
      transactions.push(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Обновляем интерфейс
      if (typeof updateBalance === 'function') {
        updateBalance();
      }
      
      // Синхронизируем с Firebase
      if (window.firebaseSync && window.firebaseSync.isInitialized) {
        window.firebaseSync.syncToFirebase();
      }
      
    } catch (error) {
      console.error('Ошибка добавления транзакции:', error);
    }
  }
  
  showQuickBalance() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const balance = transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
      // Показываем красивое модальное окно с балансом
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      `;
      
      modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1); animation: slideIn 0.3s ease;">
          <h2 style="color: #333; margin-bottom: 20px;">💰 Текущий баланс</h2>
          <div style="font-size: 48px; font-weight: bold; color: ${balance >= 0 ? '#4CAF50' : '#f44336'}; margin-bottom: 20px;">
            ${balance.toFixed(2)} zł
          </div>
          <div style="color: #666; margin-bottom: 30px;">
            Всего транзакций: ${transactions.length}
          </div>
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="background: #2196F3; color: white; border: none; padding: 15px 30px; border-radius: 10px; cursor: pointer; font-size: 16px;">
            Закрыть
          </button>
        </div>
      `;
      
      modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
      };
      
      document.body.appendChild(modal);
      
      // Убираем через 5 секунд если не закрыли
      setTimeout(() => {
        if (modal.parentElement) modal.remove();
      }, 5000);
      
    } catch (error) {
      console.error('Ошибка получения баланса:', error);
    }
  }
  
  addPersonalTouches() {
    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .personal-highlight {
        background: linear-gradient(45deg, #ff6b6b, #feca57);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }
  
  addSmartSuggestions() {
    // Умные подсказки на основе истории
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.showSmartTip();
      }, 10000); // Через 10 секунд после загрузки
    });
  }
  
  showSmartTip() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      if (transactions.length === 0) return;
      
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const recentTransactions = transactions.filter(t => 
        new Date(t.date) > lastWeek
      );
      
      const weeklySpending = recentTransactions
        .filter(t => parseFloat(t.amount) < 0)
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
      
      if (weeklySpending > 0) {
        const tip = `📊 За последнюю неделю потрачено ${weeklySpending.toFixed(0)} zł`;
        
        if (typeof window.notificationSystem !== 'undefined') {
          window.notificationSystem.show(tip, 'info', 6000);
        }
      }
      
    } catch (error) {
      console.error('Ошибка умных подсказок:', error);
    }
  }
}

// Инициализация персональных функций
window.personalFeatures = new PersonalFeatures();