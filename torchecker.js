(function() {
    /* 
	* для @Panov_SG, проверка статуса сервера при старте, контроль через 5 секунд, ручная проверка в шапке 
	*/
	'use strict';
	function start(){
		/* иконки */
		var server_status;
		var okStatus_button = '<svg id="okStatus_button" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><defs><style>.cls-1{fill:#00a912;}.cls-1,.cls-2{fill-rule:evenodd;}.cls-2{fill:#fff;}</style></defs><title>confirm</title><path class="cls-1" d="M61.44,0A61.44,61.44,0,1,1,0,61.44,61.44,61.44,0,0,1,61.44,0Z"/><path class="cls-2" d="M42.37,51.68,53.26,62,79,35.87c2.13-2.16,3.47-3.9,6.1-1.19l8.53,8.74c2.8,2.77,2.66,4.4,0,7L58.14,85.34c-5.58,5.46-4.61,5.79-10.26.19L28,65.77c-1.18-1.28-1.05-2.57.24-3.84l9.9-10.27c1.5-1.58,2.7-1.44,4.22,0Z"/></svg>';
		var errStatus_button = '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><defs><style>.cls-1{fill:#f44336;fill-rule:evenodd;}</style></defs><title>close-red</title><path class="cls-1" d="M61.44,0A61.44,61.44,0,1,1,0,61.44,61.44,61.44,0,0,1,61.44,0ZM74.58,36.8c1.74-1.77,2.83-3.18,5-1l7,7.13c2.29,2.26,2.17,3.58,0,5.69L73.33,61.83,86.08,74.58c1.77,1.74,3.18,2.83,1,5l-7.13,7c-2.26,2.29-3.58,2.17-5.68,0L61.44,73.72,48.63,86.53c-2.1,2.15-3.42,2.27-5.68,0l-7.13-7c-2.2-2.15-.79-3.24,1-5l12.73-12.7L36.35,48.64c-2.15-2.11-2.27-3.43,0-5.69l7-7.13c2.15-2.2,3.24-.79,5,1L61.44,49.94,74.58,36.8Z"/></svg>';
		var waitStatus_button = '  <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100"><rect y="25" width="10" height="50" rx="4" ry="4" fill="#fff"><animate attributeName="x" values="10;100" dur="1.2s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 10 70" to="-60 100 70" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite"/></rect><rect y="25" width="10" height="50" rx="4" ry="4" fill="#fff"><animate attributeName="x" values="10;100" dur="1.2s" begin="0.4s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 10 70" to="-60 100 70" dur="1.2s" begin="0.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="0.4s" repeatCount="indefinite"/></rect><rect y="25" width="10" height="50" rx="4" ry="4" fill="#fff"><animate attributeName="x" values="10;100" dur="1.2s" begin="0.8s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 10 70" to="-60 100 70" dur="1.2s" begin="0.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="0.8s" repeatCount="indefinite"/></rect></svg>';//'<?xml version="1.0" encoding="utf-8"?><svg id="waitStatus_button" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>';			
		/* функции */
		function tryPing(callback) {
			// использовать ссылку
			var use_link = Lampa.Storage.get('torrserver_use_link') ? Lampa.Storage.get('torrserver_use_link') : 'one';
			var server_link = use_link == 'one' ? Lampa.Storage.get('torrserver_url') : Lampa.Storage.get('torrserver_url_two');

			var url = normalizeBaseUrl(server_link) + '/echo';
			/*
            Lampa.Bell.push({
                text: "контроль адреса " + url,
                time: 5000
            });			
			*/
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.timeout = 2000;

			xhr.onload = function() {
				try {
					var responseText = this.responseText;
					var isOk = responseText.toLowerCase().indexOf('matrix.') !== -1;
					callback(isOk);
				} catch (e) {
					Lampa.Noty.show(e);
					callback(false);
				}
			};

			xhr.ontimeout = xhr.onerror = function() {
				callback(false);
			};

			xhr.send();
		}

		function normalizeBaseUrl(url) {
			if (typeof url !== 'string') {
				return null;
			}

			/* удаляем все пробелы */
			url = url.replace(/\s+/g, '');

			/* если нет протокола — добавляем http:// */
			if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)) {
				url = 'http://' + url;
			}

			/* проверяем, что протокол — http или https */
			if (!/^https?:\/\//i.test(url)) {
				return null; /* разрешены только http и https */
			}

			/* убираем завершающие слэши */
			url = url.replace(/\/+$/, '');

			/* проверяем формат: только хост и порт */
			var match = url.match(/^https?:\/\/([a-zA-Z0-9.-]+)(?::(\d+))?$/i);
			if (!match) {
				return null;
			}

			var host = match[1];
			var port = match[2];

			/* Собираем чистый URL */
			var protocol = url.toLowerCase().startsWith('https') ? 'https' : 'http';
			var clean = protocol + '://' + host;
			if (port) {
				clean += ':' + port;
			}

			return clean;
		}

		function addButton(){
			if ($('#MStatus')) $('#MStatus').remove();
			var my_status = '<div id="MStatus" class="head__action selector torr-status">' + waitStatus_button + '</div>';
			$('#app > div.head > div > div.head__actions').append(my_status);
			$('#MStatus').on('hover:enter', function() {
				$('.torr-status').find('svg').html(waitStatus_button); /* меняем на ожидание */
				/* ручная проверка */
				setTimeout(function(){
					tryPing(function(status) {
						if (status) {
							$('.torr-status').find('svg').html(okStatus_button); /* меняем на галочку */;
						} else {
							$('.torr-status').find('svg').html(errStatus_button); /* меняем на крестик */;
							Lampa.Controller.toggle('head');
						}
					});
				}, 2000);
			});		
		}

		/* добавим кнопку в шапку */
		addButton(); 

		/* проверим статус сервера на старте приложения*/
		tryPing(function(status) {
			if (status) { /* сервер ответил */
				$('.torr-status').find('svg').html(okStatus_button); /* меняем на галочку */
			} else { /* сервер молчит */
				$('.torr-status').find('svg').html(errStatus_button); /* меняем на крестик */
				setTimeout(function(){
					/* определили, что сервер молчит - ставим крестик - через секунду меняем на загрузку */
					$('.torr-status').find('svg').html(waitStatus_button); /* меняем на ожидание */
				}, 1000)		
			}
			/* повторная проверка через 5 секунд */
			setTimeout(function(){
				tryPing(function(status) {
					if (status) { /* сервер ответил */
						$('.torr-status').find('svg').html(okStatus_button); /* меняем на галочку */
					} else { /* сервер молчит */
						$('.torr-status').find('svg').html(errStatus_button); /* меняем на крестик */
					}			
				});
			}, 5000)
		});

	} // закрываем функцию start
	
	if (window.appready) start();
	else {
		Lampa.Listener.follow('app', function(e) {
			if (e.type == 'ready') start();
		})
	}
})()
