---
link: https://www.reddit.com/r/PromptEngineering/comments/1ny2pff/spent_6_months_deep_in_prompt_engineering_heres/
tags:
  - ai
  - ai/articles
  - ai/prompt
---
### ENG:
Spent 6 months deep in prompt engineering. Here's what actually moves the needle:
### РУС:
Провёл 6 месяцев в глубоком погружении в инженерию промптов. Вот что действительно даёт результат:


### ENG:
Examples beat instructions 

Wasted weeks writing perfect instructions. Then tried 3-4 examples and got instant results. Models pattern-match better than they follow rules (except reasoning models like o1)
### РУС:
Примеры эффективнее инструкций.

Потратил недели на написание идеальных инструкций — без толку. А потом попробовал 3–4 примера и сразу получил результат. Модели лучше улавливают паттерны по примерам, чем следуют правилам (за исключением моделей с продвинутым рассуждением, таких как o1).


### ENG:
Version control your prompts like code 

One word change broke our entire system. Now I git commit prompts, run regression tests, track performance metrics. Treat prompts as production code
### РУС:
Ведите контроль версий промптов так же, как код.

Одно изменённое слово полностью сломало нашу систему. Теперь я коммичу промпты в Git, запускаю регрессионные тесты и отслеживаю метрики производительности. Относитесь к промптам как к production-коду.

  

### ENG:
Test coverage matters more than prompt quality 

Built a test suite with 100+ edge cases. Found my "perfect" prompt failed 30% of the time. Now use automated evaluation with human-in-the-loop validation
### РУС:
Покрытие тестами важнее качества промпта.

Создал набор тестов с более чем 100 крайними случаями и обнаружил, что мой «идеальный» промпт проваливался в 30 % случаев. Теперь использую автоматизированную оценку с верификацией при участии человека.
  

### ENG:

Domain expertise > prompt tricks 

Your medical AI needs doctors writing prompts, not engineers. Subject matter experts catch nuances that destroy generic prompts
### РУС:
Предметная экспертиза важнее хитростей с промптами.

Для вашей медицинской ИИ-системы промпты должны писать врачи, а не инженеры. Эксперты в предметной области замечают нюансы, которые сводят на нет универсальные промпты.

### ENG:
Temperature tuning is underrated 

Everyone obsesses over prompts. Meanwhile adjusting temperature from 0.7 to 0.3 fixed our consistency issues instantly

### РУС:
Настройка температуры недооценена.

Все одержимы промптами, но при этом простое изменение температуры с 0,7 до 0,3 мгновенно решило наши проблемы с согласованностью.

  

### ENG:
Model-specific optimization required 

GPT-4o prompt ≠ Claude prompt ≠ Llama prompt. Each model has quirks. What makes GPT sing makes Claude hallucinate

### РУС:
Требуется оптимизация под конкретную модель.

Промпт для GPT-4o ≠ промпт для Claude ≠ промпт для Llama. У каждой модели свои особенности: то, что заставляет GPT «петь», заставляет Claude галлюцинировать.

  

### ENG:
Chain-of-thought isn't always better 

Complex reasoning chains often perform worse than direct instructions. Start simple, add complexity only when metrics improve

### РУС:
Цепочка рассуждений (chain-of-thought) не всегда лучше.

Сложные цепочки рассуждений зачастую работают хуже прямых инструкций. Начинайте с простого и добавляйте сложность только тогда, когда метрики действительно улучшаются.

### ENG:
Use AI to write prompts for AI 

Meta but effective: Claude writes better Claude prompts than I do. Let models optimize their own instructions

### РУС:
Используйте ИИ для написания промптов для ИИ.

Звучит мета, но работает: Claude пишет лучшие промпты для Claude, чем я сам. Позвольте моделям оптимизировать собственные инструкции.
  

### ENG:
System prompts are your foundation 

90% of issues come from weak system prompts. Nail this before touching ENG: prompts 

### РУС:
Системные промпты — ваш фундамент.

90 % проблем возникают из-за слабых системных промптов. Отработайте их до идеала, прежде чем трогать пользовательские промпты.


### ENG:
Prompt injection defense from day one 

Every production prompt needs injection testing. One clever ENG: input shouldn't break your entire system

### РУС:

Защита от внедрения промптов (prompt injection) — с первого дня.

Каждый промпт, идущий в продакшн, должен проходить тестирование на устойчивость к внедрению. Один хитроумный пользовательский ввод не должен ломать всю вашу систему.