# Отладка POCO X6 Pro - Инструкция по тестированию

## 🔍 Пошаговая диагностика

### Шаг 1: Открыть консоль браузера на POCO X6 Pro

1. Откройте приложение в браузере
2. Откройте DevTools (F12 или меню → Инструменты разработчика)
3. Перейдите на вкладку Console

### Шаг 2: Найти диагностические сообщения

Ищите следующие сообщения в консоли:

```
🔍 ДИАГНОСТИКА УСТРОЙСТВА: {
  userAgent: "Mozilla/5.0 (Linux; Android ...) POCO...",
  platform: "Linux armv8l",
  screenWidth: [число],
  viewportWidth: [число],
  touchSupport: true,
  isMobileDetected: [true/false]
}

📱 Ultra-aggressive mobile detection: {
  isPocoDevice: [true/false],
  finalResult: [true/false]
}

🔧 ФОРСИРОВАННАЯ МОБИЛИЗАЦИЯ для: [User Agent]
🎨 Применяем принудительные стили...
✅ Принудительные стили применены

🎨 ПРИМЕНЁННЫЕ СТИЛИ: {
  containerMaxWidth: "100%",
  containerPadding: "12px",
  fontSize: "16px"
}
```

### Шаг 3: Проверить классы на элементах

В Elements tab проверьте:

1. **HTML элемент** должен иметь класс `mobile-device`
2. **Body элемент** должен иметь классы: `mobile-device`, `force-mobile`, `poco-device`

### Шаг 4: Проверить применение стилей

Выберите любой элемент `.container` и проверьте Computed styles:

- `max-width: 100%`
- `padding: 12px`

### Шаг 5: Проверить размеры кнопок и полей

Выберите любую кнопку или поле ввода:

- `padding: 18px` (для полей) или `18px 28px` (для кнопок)
- `font-size: 16px`
- `min-height: 50px` или `52px`

## 🚨 Возможные проблемы и решения

### Проблема 1: finalResult: false

**Причина**: Устройство не определилось как мобильное
**Решение**: Проверить userAgent и параметры экрана

### Проблема 2: isMobileDetected: false

**Причина**: Класс mobile-device не добавился
**Решение**: Перезагрузить страницу, проверить JavaScript ошибки

### Проблема 3: Стили не применяются

**Причина**: CSS правила не срабатывают
**Решение**: Проверить наличие классов force-mobile и poco-device

### Проблема 4: Сайт всё равно "десктопный"

**Причина**: Сетка не переключилась на одну колонку
**Решение**: Проверить grid-template-columns в .stats-grid и .panel-grid

## 🔧 Принудительное исправление

Если ничего не помогает, выполните в консоли:

```javascript
// Принудительная мобилизация
document.documentElement.classList.add("mobile-device");
document.body.classList.add("mobile-device", "force-mobile", "poco-device");

// Принудительные стили
document.querySelector(".stats-grid").style.gridTemplateColumns = "1fr";
document.querySelector(".panel-grid").style.gridTemplateColumns = "1fr";
document.querySelector(".container").style.maxWidth = "100%";
document.querySelector(".container").style.padding = "12px";

console.log("✅ Принудительная мобилизация выполнена");
```

## 📋 Чек-лист успешной мобилизации

- [ ] В консоли есть сообщение "🔧 ФОРСИРОВАННАЯ МОБИЛИЗАЦИЯ"
- [ ] finalResult: true в диагностике
- [ ] HTML имеет класс mobile-device
- [ ] Body имеет классы mobile-device, force-mobile, poco-device
- [ ] Контейнер имеет max-width: 100%
- [ ] Сетки имеют grid-template-columns: 1fr
- [ ] Кнопки увеличились в размере
- [ ] Поля ввода стали крупнее
- [ ] Общий вид стал "мобильным" (одна колонка)

## 🎯 Ожидаемый результат

После всех исправлений POCO X6 Pro должен показывать:

- ✅ Одноколоночный макет
- ✅ Крупные кнопки и поля
- ✅ Увеличенные отступы
- ✅ Адаптивную типографику
- ✅ Мобильный дизайн интерфейса
