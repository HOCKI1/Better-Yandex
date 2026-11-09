// ==UserScript==
// @name         Better Yandex
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Вырезает промо и рекламу в сервисах Яндекса
// @author       Hockii x Gemini
// @match        https://ya.ru/*
// @match        https://m.ya.ru/*
// @match        https://yandex.ru/*
// @match        https://m.yandex.ru/*
// @match        https://yandex.kz/*
// @match        https://m.yandex.kz/*
// @match        https://yandex.by/*
// @match        https://m.yandex.by/*
// @match        https://yandex.com/*
// @match        https://m.yandex.com/*
// @match        https://mail.yandex.ru/*
// @match        https://touch.mail.yandex.ru/*
// @match        https://mail.yandex.kz/*
// @match        https://touch.mail.yandex.kz/*
// @match        https://mail.yandex.by/*
// @match        https://touch.mail.yandex.by/*
// @match        https://mail.yandex.com/*
// @match        https://touch.mail.yandex.com/*
// @match        https://disk.yandex.ru/*
// @match        https://touch.disk.yandex.ru/*
// @match        https://disk.yandex.kz/*
// @match        https://touch.disk.yandex.kz/*
// @match        https://disk.yandex.by/*
// @match        https://touch.disk.yandex.by/*
// @match        https://disk.yandex.com/*
// @match        https://touch.disk.yandex.com/*
// @match        https://market.yandex.ru/*
// @match        https://market.yandex.kz/*
// @match        https://market.yandex.by/*
// @updateURL    https://raw.githubusercontent.com/HOCKI1/Better-Yandex/main/Better-Yandex.user.js
// @downloadURL  https://raw.githubusercontent.com/HOCKI1/Better-Yandex/main/Better-Yandex.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = [
        // ==========================================
        // ПОИСК И ГЛАВНАЯ (YA.RU / YANDEX.*)
        // ==========================================

        // 1. Панель ссылок на сервисы Яндекса под поисковой строкой
        'nav.services-suggest',
        'nav[class*="services-suggest"]',
        'nav[aria-label="Сервисы"]',

        // 2. Всплывающий модальник установки браузера (DistributionSplashScreenModal)
        '.DistributionSplashScreenModal',
        'div[class*="DistributionSplashScreenModal"]',
        'div[class*="SplashscreenDefault"]',
        'div[class*="Modal"]:has([class*="DistributionSplashScreenModal"])',

        // 3. Ссылка/кнопка "Установить Яндекс Браузер"
        '.DistributionLinkBro',
        'div[class*="DistributionLinkBro"]',

        // 4. Фид новостей / Дзена под строкой поиска
        'div[class*="body__"][class*="_feed_yes"]',
        'div[class*="_feed_yes"]',

        // 5. Всплывающий попап сверху
        '.DistributionPopup',
        'div[class*="DistributionPopup"]',

        // ==========================================
        // ЯНДЕКС ПОЧТА И ДИСК
        // ==========================================

        // Футер экосистемы в сайдбаре (логотип 360, ссылка на приложение)
        '[data-testid="left-column_ecosystem-footer"]',
        'div[class*="EcosystemFooter-m__root"]',
        'div[class*="Aside-m__ecosystemFooter"]',
        'footer[class*="EcosystemFooter"]',
        'footer[class*="_OrbFooter"]',

        // Кнопка «Ещё» из промозавра в глобал-баре
        '[data-testid="orb-global-bar-more-button"]',
        '.promozavr-anchor-more-button',
        'div:has(> span[data-orb-global-bar] > [data-testid="orb-global-bar-more-button"])',

        // Правый рекламный контейнер с кнопкой отключения
        'div[style*="--rc-adaptive-width"]',
        'div[class*="PageLayout-m__body"] > div:has([class*="DisableAdsButton"])',
        'div[class*="PageLayout-m__body"] > div:has(a[href*="pro_right_column_button"])',

        // Мобильное промо (QR-код и сторы)
        'div[class*="MobileAppPromo"]',

        // Блоки монетизации
        'div[class*="MonetizationItemContainer"]',

        // Сервисные кнопки в боковой панели (скрываем чужие сервисы, сохраняя активный)
        'div[data-key][data-servicewrap]:not(:has([data-testid*="current"]))',
        'div[class*="ServiceWrapBlock"][data-key]:not(:has([data-testid*="current"]))',
        'div:has(> span > [data-testid="orb-global-bar-service-button"])',

        // Промо-карусели в левом меню
        '[data-testid="aside_promo_carousel_banner"]',
        '.promozavr-anchor-carousel-banner',

        // Кнопка «Установить приложение» в сайдбаре Яндекс Диска
        'div:has(> a[href*="disk/download"])',
        'a[href*="disk/download?src=Yandex.Sidebar"]',

        // Мобильный попап «Почта лучше в приложении» (скрываем строго сам корень модалки)
        'div[class*="PopupAggressivePromoApps"]',
        'div[class*="Modal"]:has([class*="PopupAggressivePromoApps"])',

        // Промо приложения в сайдбаре мобильной почты
        'a.sidebarPromo',
        'a[class*="sidebarPromo"]',
        'a[href*="source=sidebartouch"]',

        // Плавающая кнопка «Открыть в приложении» (FAB) в мобильной почте
        'div[class*="FloatingButton-m__container"]',
        'a[class*="FloatingButton-m__fabLink"]',
        'div:has(> a[href*="source=mailtouchfloatapp"])',

        // ==========================================
        // ЯНДЕКС ПОИСК
        // ==========================================

        // Рекламные сниппеты в результатах поиска
        'li:has(a[href*="/search/_sttc/"])',
        'li:has([data-wylac*=\'"type":"adv"\'])',
        'li:has([data-wylac*="about-advertiser"])',

        // ==========================================
        // ЯНДЕКС КАРТИНКИ
        // ==========================================

        // Рекламные блоки и галереи в Яндекс Картинках
        'div[class*="-List"]:has(a[href*="/images/_crpd/"])',
        'div[class*="-List"]:has(.AdvLabel)',
        'div:has(> a[href*="/images/_crpd/"])',
        '.AdvLabel',

        // Баннерная врезка в сетке картинок (JustifierRowLayout-Incut)
        '.JustifierRowLayout-Incut:has([aria-label*="реклам"])',
        '[aria-label="Баннер с рекламой"]',
        '.JustifierRowLayout-Incut:has(div[id*="-cross-page-"])',

        // ==========================================
        // ЯНДЕКС ВИДЕО
        // ==========================================

        // Рекламные врезки в Яндекс Видео (RTB / Direct блоки в сетке)
        'li:has(div[id*="-R-I-"])',
        'li[class*="Feature"]:has(div[id*="R-I"])',
        'li:has(div[id^="search-list-"][id*="-R-I-"])',

        // Рекламный блок под плеером в Яндекс Видео
        'div:has(> div[id^="video-viewer-"])',
        'div[class*="_withStore"]:has(> div[id^="video-viewer-"])',

        // Рекламные врезки в ленте похожих видео (Direct / РТБ)
        'div[class*="VideoListPageDirect"]',
        'div:has(> div[id^="video-viewer-"][id*="-_r_"])',
        'div[class*="_withStore"]:has(> div[id^="video-viewer-"][id*="-_r_"])',

        // ==========================================
        // ЯНДЕКС ПОГОДА
        // ==========================================

        // Прилипающий баннер с предложением скачать приложение
        'div[class*="AppPromoInner_container"]',
        'div[class*="AppPromoInner_fixedBlockStyle"]',

        // Кнопка скачивания приложения в левой панели
        'div[class*="AppLeftPanelPromosClient_buttons"]',
        'button[class*="AppLeftPanelPromosClient_weatherBtn"]',

        // 1. Правая колонка с рекламой / e-com виджетом
        'aside[data-right-sidebar="true"]:has([class*="AppMoneySidebarEcom"])',
        'div[class*="AppMoneySidebarEcom_wrap"]',

        // 2. Верхний рекламный баннер
        'div[class*="MainPage_topBlockWithMoney"]',

        // 3. Рекламные карточки и плейсхолдеры в прогнозе
        'li[class*="AppForecastMoney_wrap"]',
        '#forecast_third_adv',
        'article[class*="AppMoney_wrap"]',
        'div[id^="money-"]',

        // 4. Блок ссылок на сторы в футере
        'li[class*="AppFooterLinks_imageLink"]',
        'div:has(> ul > li[class*="AppFooterLinks_imageLink"])',

        // Блок статей / «Журнал погоды» на главной странице Погоды
        'article[class*="AppBlogPreview_article"]',
        'article[class*="MainPage_blog"]',
        'article:has(a[href*="/blog"])',

        // ==========================================
        // ЯНДЕКС МАРКЕТ
        // ==========================================

        // Рекламные баннеры и кликауты Директа в выдаче Маркета
        'div[data-baobab-name="linkSnippet"][data-zone-data*="advTagInfo"]',
        'div[data-baobab-name="linkSnippet"][data-zone-data*="directCampaignId"]',
        'div[data-zone-data*=\'"type":"banner"\']',
        'div:has(> div > div > div > a[href*="/an/count/"])',
        'div[class*="urbanads-dark"]',

        // Вся ячейка сетки с рекламным промо-баннером в ленте Маркета (вместе с grid-оберткой)
        'div[style*="grid-row"]:has([data-zone-name="recomMadv"])',
        'div[style*="grid-row"]:has([data-baobab-name="recomMadv"])',
        'div[style*="grid-row"]:has([data-apiary-widget-name="@monetize/MediaContent"])',
        'div[style*="grid-row"]:has([data-zone-data*="advertisementId"])',
        'div[data-zone-name="recomMadv"]',

        // Всплывающий FOMO-виджет со скидками и таймером в Маркете
        'div[data-zone-name="fomoPopup"]',
        'div[data-baobab-name="fomoPopup"]',
        'div:has(> a[href*="/page/wow_sale"])',

        // Всплывающая снизу шторка (Drawer) «В приложении — выгодно» в мобильном Маркете
        'div[id*="/template/drawer"]:has([data-zone-name="appDistributionPopup"])',
        'div[id*="/template/drawer"]:has([data-apiary-widget-name*="AppDistributionContent"])',
        'div[data-apiary-widget-name="@light/Drawer"]:has([data-zone-name="appDistributionPopup"])',
        'div[data-zone-name="appDistributionPopup"]',

        // Промо-блок со сторами и QR-кодом в десктопном футере Маркета
        'div[id*="/footer/appPromoLoader"]',
        'div[data-apiary-widget-name*="DistributionFooterDesktop"]',
        'div:has(> div > [data-auto="qrCodePicture"])',

    ];

    const style = document.createElement('style');
    style.id = 'ya-cleaner-prod';
    style.textContent = `
        /* Скрытие всех рекламных, промо и сервисных элементов */
        ${SELECTORS.join(',\n        ')} {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            min-width: 0 !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
            overflow: hidden !important;
        }

        /* Разблокировка скролла, если модалка заблокировала body/html */
        html:has(.DistributionSplashScreenModal),
        body:has(.DistributionSplashScreenModal),
        html:has([class*="DistributionSplashScreenModal"]),
        body:has([class*="DistributionSplashScreenModal"]),
        html:has([class*="PopupAggressivePromoApps"]),
        body:has([class*="PopupAggressivePromoApps"]) {
            overflow: auto !important;
            position: static !important;
        }

        /* Разблокировка скролла при вызове промо-дровера Маркета */
        html:has([data-zone-name="appDistributionPopup"]),
        body:has([data-zone-name="appDistributionPopup"]) {
            overflow: auto !important;
            position: static !important;
        }
    `;

    if (document.head) {
        document.head.appendChild(style);
    } else {
        const root = document.documentElement || document;
        root.appendChild(style);
    }

    // Пересборка сетки товаров на Маркете в авто-режим без дыр
    if (location.hostname.includes('market.')) {
        const marketGridStyle = document.createElement('style');
        marketGridStyle.id = 'ya-market-grid-fix';
        marketGridStyle.textContent = `
            /* Включаем плотный автопоток для грид-контейнера */
            div:has(> div[style*="grid-row"][style*="grid-column"]) {
                grid-auto-flow: row dense !important;
            }

            /* Сбрасываем жесткие координаты строк и колонок у карточек */
            div:has(> div[style*="grid-row"][style*="grid-column"]) > div[style*="grid-row"][style*="grid-column"] {
                grid-row: auto !important;
                grid-column: auto !important;
            }
        `;
        (document.head || document.documentElement).appendChild(marketGridStyle);
    }
})();