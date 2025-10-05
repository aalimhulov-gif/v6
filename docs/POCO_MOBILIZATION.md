# Ультра-агрессивная мобилизация для POCO X6 Pro

## Проблема

POCO X6 Pro и подобные современные Android флагманы имеют:

- Высокое разрешение экрана (часто больше 1080px в ширину)
- Отличную производительность
- Современные браузеры, которые могут отображать "десктопные" версии сайтов

Из-за этого стандартные методы детекции мобильных устройств не срабатывают.

## Применённые решения

### 1. Ультра-агрессивная JavaScript детекция

#### Расширенные User Agent паттерны:

```javascript
/poco/i, /xiaomi/i, /miui/i, /android.*poco/i, /linux.*android/i;
```

#### Снижение порогов детекции:

- **Ширина экрана**: до 1400px (было 1200px)
- **Соотношение сторон**: >1.3 (было >1.5)
- **Device Pixel Ratio**: ≥1.5 (было ≥2)

#### Дополнительные проверки:

- **Платформа**: `navigator.platform` содержит "android" или "linux armv"
- **Connection API**: медленное соединение (2g, 3g)
- **Комбинированная логика**: Android + Touch = Mobile

### 2. Принудительные CSS стили

#### Агрессивные медиа-запросы:

```css
@media screen and (max-width: 1600px) and (pointer: coarse) @media screen and (max-width: 1500px) and (pointer: coarse);
```

#### Принудительные стили для класса `.mobile-device`:

```css
.mobile-device .form-group input {
  padding: 18px !important;
  font-size: 16px !important;
  min-height: 50px !important;
}
```

### 3. JavaScript принуждение

#### Автоматическое применение стилей:

```javascript
const isProblematicDevice =
  /poco|xiaomi|miui|android/i.test(userAgent) && window.innerWidth <= 1400;

if (isProblematicDevice) {
  // Принудительно применяем мобильные стили
  input.style.padding = "18px";
  input.style.fontSize = "16px";
}
```

### 4. Обновлённый viewport

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
/>
```

## Логика детекции по приоритету

1. **User Agent содержит "poco", "xiaomi", "miui"** → MOBILE
2. **Android + Touch Support** → MOBILE
3. **Touch + Width ≤ 1400px** → MOBILE
4. **Touch + Aspect Ratio > 1.3** → MOBILE
5. **High DPR + Touch + Narrow Screen** → MOBILE
6. **Mobile Platform Detection** → MOBILE
7. **Slow Connection Type** → MOBILE

## Отладка

### Консольные сообщения:

```
📱 Ultra-aggressive mobile detection: {
  userAgent: "...",
  isPocoDevice: true,
  isAndroidDevice: true,
  hasTouchSupport: true,
  viewportWidth: 393,
  finalResult: true
}

🔧 Применяем принудительную мобилизацию для: Mozilla/5.0...POCO...
```

### Проверочный список:

1. ✅ Открыть консоль браузера на POCO X6 Pro
2. ✅ Найти сообщение "Ultra-aggressive mobile detection"
3. ✅ Проверить `finalResult: true`
4. ✅ Убедиться, что добавлен класс `mobile-device`
5. ✅ Проверить принудительное применение стилей

## Ожидаемый результат

После всех изменений POCO X6 Pro должен:

- ✅ Определяться как мобильное устройство
- ✅ Получать класс `mobile-device`
- ✅ Применять принудительные мобильные стили
- ✅ Показывать адаптированную мобильную версию сайта
- ✅ Иметь увеличенные кнопки и поля ввода
- ✅ Использовать одноколоночный макет

## Fallback стратегия

Если и это не поможет, можно:

1. Добавить ручное переключение в настройках
2. Использовать серверную детекцию по User Agent
3. Применить принудительный мобильный режим для всех Android устройств
