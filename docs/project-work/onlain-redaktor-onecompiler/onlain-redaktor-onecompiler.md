---
title: "Онлайн-редактор OneCompiler"
---

[Перейти на сайт](https://ru.hexlet.io)

# Онлайн-редактор OneCompiler

Иногда нужно быстро запустить код или проверить запрос, а тратить время на установку среды на компьютер не хочется. В этой статье разберём онлайн-редактор OneCompiler: как запускать в нём код на разных языках и как поделиться кодом ссылкой.

## Что такое OneCompiler

[OneCompiler](https://onecompiler.com/) — это бесплатный онлайн-редактор кода. Он запускает код прямо в браузере, ничего не нужно устанавливать на компьютер, регистрация не обязательна. Сервис поддерживает множество языков программирования (Python, JavaScript, PHP, Go, Java, C, C++ и другие) и базы данных, например PostgreSQL.

Где это пригодится:

- **Как альтернатива GitHub Codespaces при работе над проектом.** Если по каким-то причинам не получается работать в Codespaces, код можно писать и запускать в OneCompiler, а готовый файл — загрузить в репозиторий.
- **Для любых экспериментов с кодом.** Захотелось проверить идею, разобрать пример из урока или быстро прогнать небольшой скрипт — открыли редактор и сразу запустили, без настройки окружения.

:::caution
OneCompiler — это «черновик» для запуска кода. Это не замена полноценной среды разработки: сложные проекты с зависимостями и тестами здесь не поднять. Для проекта основная среда — GitHub Codespaces (см. [Как работать в GitHub Codespaces](/docs/project-work/kak-rabotat-v-github-codespaces/kak-rabotat-v-github-codespaces.md)).
:::

## Выбираем язык

У каждого языка свой адрес. Откройте нужную страницу напрямую:

- Python — [onecompiler.com/python](https://onecompiler.com/python)
- JavaScript — [onecompiler.com/javascript](https://onecompiler.com/javascript)
- PHP — [onecompiler.com/php](https://onecompiler.com/php)
- Go — [onecompiler.com/go](https://onecompiler.com/go)
- Java — [onecompiler.com/java](https://onecompiler.com/java)
- PostgreSQL — [onecompiler.com/postgresql](https://onecompiler.com/postgresql)

Список всех языков и баз данных есть на [главной странице](https://onecompiler.com/) — выберите нужный из списка. А прямо в редакторе язык можно сменить кнопкой-переключателем вверху.

![Выбор языка на главной странице OneCompiler](/img/docs/img-195--onecompiler-languages.png)

## Запускаем код

Интерфейс редактора устроен одинаково для всех языков:

- **Слева — редактор кода.** Здесь уже открыт файл с небольшим примером (например, `main.py` для Python). Замените его содержимое своим кодом.
- **Сверху — кнопка `Run`.** Она запускает код.
- **Справа — результат.** Для языков программирования это вкладка `Console`, для баз данных — панель `Output`.

Напишите код и нажмите **Run** — результат появится справа. Например, простой код на Python:

```python
name = "Hexlet"
for i in range(1, 4):
    print(f"{i}: привет, {name}!")
```

![Запуск кода на Python в OneCompiler](/img/docs/img-196--onecompiler-python-run.png)

Тот же пример на других языках выглядит так.

**JavaScript:**

```javascript
const name = "Hexlet";
for (let i = 1; i <= 3; i += 1) {
  console.log(`${i}: привет, ${name}!`);
}
```

**PHP:**

```php
<?php
$name = "Hexlet";
for ($i = 1; $i <= 3; $i++) {
  echo "$i: привет, $name!\n";
}
```

**Go:**

```go
package main

import "fmt"

func main() {
	name := "Hexlet"
	for i := 1; i <= 3; i++ {
		fmt.Printf("%d: привет, %s!\n", i, name)
	}
}
```

**Java:**

```java
public class Main {
    public static void main(String[] args) {
        String name = "Hexlet";
        for (int i = 1; i <= 3; i++) {
            System.out.println(i + ": привет, " + name + "!");
        }
    }
}
```

Если в коде есть ошибка, её описание появится в области вывода — можно сразу исправить и запустить снова.

### Работа с базой данных

Для SQL откройте страницу [onecompiler.com/postgresql](https://onecompiler.com/postgresql). Откроется редактор с готовым примером:

![Стартовый экран PostgreSQL в OneCompiler](/img/docs/img-192--onecompiler-start.png)

Замените пример своим SQL: можно сразу создать таблицу, наполнить её данными и написать запрос. После нажатия **Run** результат последнего запроса покажется в виде таблицы:

![Результат SQL-запроса в OneCompiler](/img/docs/img-193--onecompiler-result.png)

Как наполнить базу данных и выполнять запросы по шагам — подробно разобрано в статье [Как практиковаться в выполнении SQL запросов](/docs/practice-guides/kak-praktikovatsya-v-vypolnenii-sql-zaprosov/kak-praktikovatsya-v-vypolnenii-sql-zaprosov.md).

## Загружаем решение на GitHub

Если вы пишете код для проекта, готовый файл нужно загрузить в репозиторий проекта на GitHub. Как это сделать через веб-интерфейс, со скриншотами — в отдельной статье [Как работать с GitHub через веб-интерфейс](/docs/project-work/rabota-s-github-cherez-veb-interfeys/rabota-s-github-cherez-veb-interfeys.md).

## Делимся кодом по ссылке

Иногда нужно показать свой код другому человеку — например, наставнику или сокурснику. В OneCompiler для этого есть кнопка **Share** (значок «поделиться» рядом с кнопкой **Save** вверху справа).

Откроется окно **Save your code**: введите название (**Title**), при желании — описание, и выберите, кому будет виден код в разделе **Who can see this?**:

- **Public** — код виден всем и может попасть в поиск по сайту.
- **Unlisted** — код доступен только по прямой ссылке. Подходящий вариант, чтобы поделиться кодом, не выкладывая его в общий доступ.
- **Private** — код виден только вам (нужен вход в аккаунт).

![Окно «Save your code» с выбором видимости](/img/docs/img-197--onecompiler-share.png)

После сохранения адрес страницы станет постоянной ссылкой на ваш код — её можно скопировать из адресной строки браузера и отправить.
