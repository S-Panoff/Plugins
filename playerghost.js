	/* Прозрачность элементов в плеере */
setTimeout(function(){	
	function opacityMod(value, needFocus) {
				localStorage.setItem("Player_opacity", value);//сохраняем настройку
	/*			
				document.querySelector('.player-info').style.setProperty('opacity', value, 'important');
				document.querySelector('.player-panel').style.setProperty('opacity', value, 'important');	
				document.querySelector('.player-video__loader').style.setProperty('opacity', value, 'important');
				document.querySelector('.player-video__paused').style.setProperty('opacity', value, 'important');
				document.querySelector('.player-video__subtitles').style.setProperty('opacity', value, 'important');
	*/			
				setTimeout(function(){		
					if (!$('body').hasClass('selectbox--open') && needFocus) setFocus();
				}, 100)			
	if ($('#playerOpacityStyle')) $('#playerOpacityStyle').remove();
	$('body').append($('<div id="playerOpacityStyle"><style>'+
	'.player-panel__line,'+
	'.player-panel__timeline,'+
	'.player-info__line,'+
	'.player-info__values,'+
	'.player-info__error,'+
	'.player-video__loader,'+
	'.player-video__paused svg{opacity: ' + value + '!important}'+
	'</style></div>'));
	}	
	
	function setFocus() {
					Lampa.Controller.toggle('player');
					document.querySelector('.player-video').style.setProperty('opacity', '1', 'important');
					Lampa.Controller.move('down')
					Lampa.Controller.move('down')
	}
	
	
	function buildMenu() {
		var sub_menu_settings = [];
			sub_menu_settings.push({
				title: '100%',
				todo: 'do100'
			})
			sub_menu_settings.push({
				title: '80%',
				todo: 'do80'
			})	
			sub_menu_settings.push({
				title: '60%',
				todo: 'do60'
			})		
			sub_menu_settings.push({
				title: '40%',
				todo: 'do40'
			})		
			
//

//
			function jQueryToNative(jQuerySelector) {
					if (typeof jQuerySelector === 'string') {
						return document.querySelector(jQuerySelector);
					} else if (jQuerySelector instanceof jQuery) {
						return jQuerySelector.get(0);
					} else {
						return jQuerySelector;
					}
			}
			
			Lampa.Select.show({
				title: 'Непрозрачность элементов плеера',
				items: sub_menu_settings,
				onBack: function onBack() {
					setFocus();
				},
				onSelect: function onSelect(a) {
				  if (a.todo == "do100"){
					opacityMod('1', true);
				  };				  
				  if (a.todo == "do80"){
					opacityMod('0.8', true);
				  };				  
				  if (a.todo == "do60"){
					opacityMod('0.6', true);
				  };				  
				  if (a.todo == "do40"){
					opacityMod('0.4', true);
				  };				  
				}
			})
			
	}
				
			  
	Lampa.Controller.listener.follow('toggle', function(e) {
		if (e.name == 'select' && Lampa.PlayerPanel.visibleStatus() && $('.selectbox__title').text() == 'Настройки') {
			setTimeout(function(){
				function jQueryToNative(jQuerySelector) {
					if (typeof jQuerySelector === 'string') {
						return document.querySelector(jQuerySelector);
					} else if (jQuerySelector instanceof jQuery) {
						return jQuerySelector.get(0);
					} else {
						return jQuerySelector;
					}
				}				
				//
				var hideEngLang = $('<div id="opacityInPlayerPanel" class="selectbox-item selector">' + 
									'<div class="selectbox-item__title">Уровень непрозрачности панелек</div>' +
									'</div>');				
			
				var scrollCollection = $('.selectbox__body').find('.scroll__body');
				scrollCollection.append(hideEngLang);
				scrollCollection = jQueryToNative(scrollCollection);
				scrollCollection.insertBefore(scrollCollection.lastChild, scrollCollection.firstChild);
				Lampa.Controller.collectionSet(scrollCollection)
				Lampa.Controller.move('up')
				$('#opacityInPlayerPanel').on('hover:enter', function () {
					//
					buildMenu();
				})
			}, 100);
		}
		if (e.name == 'select' && Lampa.PlayerPanel.visibleStatus() && $('.selectbox__title').text() == 'Непрозрачность элементов плеера') {
			setTimeout(function(){
				var parsedOpacity = parseFloat(localStorage.getItem("Player_opacity"));
				var currentValue = (isFinite(parsedOpacity)) ? parsedOpacity * 100 : 100;
				
				//100*parseFloat(localStorage.getItem("Player_opacity") || 1);
				//selectbox //$($('.scroll__body')[$('.scroll__body').length - 1])
				$($('.selectbox .scroll__body')[0]).find('.selectbox-item__title').each(function() {
					if ($(this).text().includes(currentValue)) {
						$(this).parent().addClass('selected');
					}
				});
			}, 100);
		}
	});
	
	Lampa.Player.listener.follow('start', function () {
		var currentOpacity = localStorage.getItem("Player_opacity") || '1';
		setTimeout(function(){ opacityMod(currentOpacity); }, 100);
	})
/*	
	$('.open--feed').unbind('hover:enter').on('hover:enter', function () {
		Lampa.Player.play({url:""})
	})
*/
}, 5000)