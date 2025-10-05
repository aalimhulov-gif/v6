// ========== ПРОСТОЕ РЕЗЕРВНОЕ КОПИРОВАНИЕ ==========

class SimpleBackup {
  constructor() {
    this.init();
  }
  
  init() {
    // Добавляем кнопки резервного копирования в бургер-меню
    this.addBackupButtons();
  }
  
  addBackupButtons() {
    // Ждем загрузку DOM
    document.addEventListener('DOMContentLoaded', () => {
      const burgerContent = document.querySelector('.burger-menu-content');
      if (burgerContent) {
        
        // Разделитель перед backup функциями
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background: rgba(255,255,255,0.2); margin: 15px 0;';
        burgerContent.appendChild(separator);
        
        // Кнопка экспорта данных
        const exportBtn = document.createElement('button');
        exportBtn.className = 'burger-item';
        exportBtn.innerHTML = '📤 Скачать резервную копию';
        exportBtn.onclick = () => {
          this.exportData();
          this.closeBurgerMenu();
        };
        burgerContent.appendChild(exportBtn);
        
        // Кнопка импорта данных
        const importBtn = document.createElement('button');
        importBtn.className = 'burger-item';
        importBtn.innerHTML = '📥 Восстановить из копии';
        importBtn.onclick = () => {
          this.importData();
          this.closeBurgerMenu();
        };
        burgerContent.appendChild(importBtn);
        
        // Кнопка полной очистки (только если действительно нужна)
        const clearBtn = document.createElement('button');
        clearBtn.className = 'burger-item';
        clearBtn.innerHTML = '🗑️ Очистить все данные';
        clearBtn.style.color = '#ff6b6b';
        clearBtn.onclick = () => {
          this.clearAllData();
          this.closeBurgerMenu();
        };
        burgerContent.appendChild(clearBtn);
      }
    });
  }
  
  closeBurgerMenu() {
    if (typeof closeBurgerMenu === 'function') {
      closeBurgerMenu();
    }
  }
  
  // Экспорт всех данных
  exportData() {
    try {
      const data = {
        transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
        categories: JSON.parse(localStorage.getItem('categories') || '[]'),
        goals: JSON.parse(localStorage.getItem('goals') || '[]'),
        budgetCategories: JSON.parse(localStorage.getItem('budgetCategories') || '[]'),
        recurringTransactions: JSON.parse(localStorage.getItem('recurringTransactions') || '[]'),
        settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
        exportDate: new Date().toISOString(),
        version: '6.1'
      };
      
      // Создаем красивое имя файла с датой
      const now = new Date();
      const dateStr = now.toLocaleDateString('ru-RU').replace(/\./g, '-');
      const filename = `Семейный_Бюджет_${dateStr}.json`;
      
      // Скачиваем файл
      this.downloadJSON(data, filename);
      
      if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.show(
          `✅ Резервная копия сохранена: ${filename}`, 
          'success', 
          4000
        );
      }
      
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.show('❌ Ошибка при создании резервной копии', 'error');
      }
    }
  }
  
  // Импорт данных
  importData() {
    // Создаем скрытый input для выбора файла
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Проверяем, что это наш файл
          if (!data.transactions || !data.exportDate) {
            throw new Error('Неверный формат файла');
          }
          
          // Подтверждение восстановления
          if (confirm('⚠️ Это действие заменит все текущие данные. Продолжить?')) {
            
            // Восстанавливаем данные
            localStorage.setItem('transactions', JSON.stringify(data.transactions));
            localStorage.setItem('categories', JSON.stringify(data.categories || []));
            localStorage.setItem('goals', JSON.stringify(data.goals || []));
            localStorage.setItem('budgetCategories', JSON.stringify(data.budgetCategories || []));
            localStorage.setItem('recurringTransactions', JSON.stringify(data.recurringTransactions || []));
            localStorage.setItem('appSettings', JSON.stringify(data.settings || {}));
            
            if (typeof window.notificationSystem !== 'undefined') {
              window.notificationSystem.show(
                '✅ Данные восстановлены из резервной копии!', 
                'success', 
                4000
              );
            }
            
            // Перезагружаем страницу для обновления интерфейса
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
          
        } catch (error) {
          console.error('Ошибка импорта:', error);
          if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.show('❌ Ошибка при восстановлении данных. Проверьте файл.', 'error');
          }
        }
      };
      
      reader.readAsText(file);
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }
  
  // Полная очистка данных
  clearAllData() {
    if (confirm('⚠️ ВНИМАНИЕ! Это удалит ВСЕ данные безвозвратно!\n\nВы уверены?')) {
      if (confirm('🚨 ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ!\n\nВсе транзакции, цели и настройки будут удалены!\nПродолжить?')) {
        
        try {
          // Полная очистка localStorage
          console.log('🗑️ Начинаем полную очистку данных...');
          
          // Очищаем весь localStorage
          localStorage.clear();
          console.log('✅ localStorage полностью очищен');
          
          // Дополнительно удаляем специфичные ключи если они остались
          const keysToRemove = [
            'transactions', 'categories', 'goals', 'budgetCategories', 
            'recurringTransactions', 'appSettings', 'lastBackupDate',
            'budgetAppAuth', 'protectionEnabled', 'lastSyncTime'
          ];
          
          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
          });
          
          // Очищаем и Firebase если подключен
          if (window.firebaseSync && window.firebaseSync.isInitialized) {
            try {
              const database = window.firebaseSync.database;
              database.ref().remove(); // Удаляем ВСЁ
              console.log('✅ Firebase данные тоже очищены');
            } catch (error) {
              console.log('⚠️ Ошибка очистки Firebase:', error);
            }
          }
          
          // Показываем уведомление
          alert('🗑️ Все данные полностью удалены!\n\nСтраница будет перезагружена.');
          
          // Принудительная перезагрузка без кеша
          setTimeout(() => {
            window.location.reload(true);
          }, 1000);
          
        } catch (error) {
          console.error('❌ Ошибка очистки данных:', error);
          alert('❌ Ошибка при очистке данных: ' + error.message);
        }
      }
    }
  }
  
  // Вспомогательная функция для скачивания JSON
  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }
}

// Инициализация системы бэкапа
window.simpleBackup = new SimpleBackup();