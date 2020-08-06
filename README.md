## Тесты. Анализ скриншотов.
###Среды для запуска
####Chromium
`rm -rf node_modules`

`PUPPETEER_PRODUCT=chromium yarn install`

####Firefox
`rm -rf node_modules`

`PUPPETEER_PRODUCT=firefox yarn install`

###Особености
* Threshold для firefox нужно выставлять < 1.
* В firefox в ~10-20 раз быстрее создаются screenshots, чем в chromium.
* Для запуска тестов нужен build  