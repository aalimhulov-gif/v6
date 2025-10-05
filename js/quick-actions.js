// ========== БЫСТРЫЕ ДЕЙСТВИЯ ==========

class QuickActions {
  constructor() {
    this.isEnabled = true; // Можно включать/выключать
    this.init();
  }
  
  init() {
    if (!this.isEnabled) return;
    
    // Добавляем быстрые кнопки после загрузки DOM
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.createFloatingButtons();
        this.setupHotkeys();
      }, 1000); // Задержка чтобы всё точно загрузилось
    });
  }
  
  createFloatingButtons() {
    // Проверяем не создали ли уже
    if (document.getElementById('quickActionsPanel')) return;
    
    const panel = document.createElement('div');
    panel.id = 'quickActionsPanel';
    panel.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 999;
      transition: all 0.3s ease;
      opacity: 0.9;
    `;
    
    // Быстрый доход
    const incomeBtn = this.createButton('💰', '#4CAF50', () => {
      this.quickAddIncome();
    }, 'Быстрый доход (Ctrl+1)');
    
    // Быстрый расход  
    const expenseBtn = this.createButton('💸', '#f44336', () => {
      this.quickAddExpense();
    }, 'Быстрый расход (Ctrl+2)');
    
    // Показать баланс
    const balanceBtn = this.createButton('📊', '#2196F3', () => {
      this.showQuickBalance();
    }, 'Баланс (Ctrl+B)');
    
    panel.appendChild(incomeBtn);
    panel.appendChild(expenseBtn);
    panel.appendChild(balanceBtn);
    
    document.body.appendChild(panel);
    
    // Автоскрытие на мобильных
    this.setupAutoHide(panel);
    
    console.log('✅ Плавающие кнопки созданы');
  }
  
  createButton(emoji, color, onClick, title) {
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
      font-size: 22px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    `;
    
    // Эффекты при наведении
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    });
    
    btn.addEventListener('click', onClick);
    
    return btn;
  }
  
  setupAutoHide(panel) {
    // Скрываем на узких экранах
    const checkVisibility = () => {
      const isNarrow = window.innerWidth < 768;
      const burgerMenu = document.getElementById('burgerMenu');
      const isMenuOpen = burgerMenu && burgerMenu.style.display !== 'none';
      
      if (isNarrow || isMenuOpen) {
        panel.style.opacity = '0';
        panel.style.pointerEvents = 'none';
      } else {
        panel.style.opacity = '0.9';
        panel.style.pointerEvents = 'auto';
      }
    };
    
    window.addEventListener('resize', checkVisibility);
    checkVisibility(); // Проверяем сразу
    
    // Проверяем периодически
    setInterval(checkVisibility, 1000);
  }
  
  setupHotkeys() {
    document.addEventListener('keydown', (e) => {
      // Только если нет активных input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.ctrlKey || e.metaKey) {
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
    
    console.log('✅ Горячие клавиши настроены');
  }
  
  quickAddIncome() {
    const amount = prompt('💰 Добавить доход:\n\nВведите сумму (например: 1000):');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const description = prompt('📝 Описание (необязательно):') || 'Быстрый доход';
      
      this.addTransaction(parseFloat(amount), 'income', description);
      
      if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.show(`💰 Добавлен доход: +${amount} zł`, 'success');
      }
    }
  }
  
  quickAddExpense() {
    const amount = prompt('💸 Добавить расход:\n\nВведите сумму (например: 500):');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const description = prompt('📝 Описание (необязательно):') || 'Быстрый расход';
      
      this.addTransaction(-parseFloat(amount), 'expense', description);
      
      if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.show(`💸 Добавлен расход: -${amount} zł`, 'success');
      }
    }
  }
  
  addTransaction(amount, type, description) {
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
      
      console.log('✅ Транзакция добавлена:', newTransaction);
      
    } catch (error) {
      console.error('❌ Ошибка добавления транзакции:', error);
      if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.show('❌ Ошибка при добавлении', 'error');
      }
    }
  }
  
  showQuickBalance() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const balance = transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
      // Простое уведомление с балансом
      if (typeof window.notificationSystem !== 'undefined') {
        const message = `💰 Текущий баланс: ${balance.toFixed(2)} zł`;
        window.notificationSystem.show(message, 'info', 5000);
      } else {
        // Fallback через alert
        alert(`💰 Текущий баланс: ${balance.toFixed(2)} zł`);
      }
      
    } catch (error) {
      console.error('❌ Ошибка получения баланса:', error);
    }
  }
  
  // Включить/выключить быстрые действия
  toggle() {
    this.isEnabled = !this.isEnabled;
    
    if (this.isEnabled) {
      this.createFloatingButtons();
      console.log('✅ Быстрые действия включены');
    } else {
      const panel = document.getElementById('quickActionsPanel');
      if (panel) panel.remove();
      console.log('❌ Быстрые действия выключены');
    }
  }
}

// Инициализация быстрых действий
window.quickActions = new QuickActions();