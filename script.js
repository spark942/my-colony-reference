$("#menu-toggle").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
});


window.addEventListener("load",initApp,false);
var imgSource = 'https://www.apewebapps.com/apps/my-colony/0.26.0/images/';
function initApp() {

	var stages = [];
	$.each(window.ColonyGame.meta.gameStages, function(index, data) {
		stages.push(data.threshold);
	});


	var items = [];
	var itemSmallInfo = [];
	var itemLinks = [];
	var filterableColumnNames = [
		"Name",
		"Type",
		"Stage",
		"Independence",
		"BuildingCategories",
		"crMoney",
		"crFood",
		"crWater",
		"crHelium3",
		"crRum",
		"crWood",
		"crCharcoal",
		"crOre",
		"crRegolith",
		"crClay",
		"crWool",
		"crSteel",
		"crOil",
		"crGold",
		"crAluminium",
		"crUranium",
		"crPottery",
		"crPlastic",
		"crBricks",
		"crCloth",
		"crToy",
		"crMicrochip",
		"crAtmosphere",
		"crResearch",
		"crCivics",
		"crAlienArtifact"];

	var identify = function(name) {
		return name.toLowerCase().replace(/\s+/g, '');
	};

	var resPerTile = function(tilesize, resource) {
		if (tilesize && tilesize > 1) {
		return ' <span class="amount-per-tile">(' + Math.round(resource/tilesize * 100) / 100 + '/t)</span>';
		}
		return '';
	};

	function addDataToList(typeName, typeData) {
		var itemData = {
			value: identify(typeData.name),
			label: typeData.name,
			desc: 'Stage ' + typeData.requiresStage + ' - ' + typeName,
			type: typeName,
			color: typeData.transModeColor ? typeData.transModeColor : '#000000'
		};
		if (typeName == 'building') {
			if (itemData.passable == true) {
				itemData.type = 'pavement';
				itemData.desc = 'Stage ' + typeData.requiresStage + ' - pavement';
			}
			if (itemData.color == '#000000') {
				itemData.color = '#c0392b';
			}
			itemData.desc += ' (' + typeData.tileWidth + 'x' + typeData.tileHeight + ')' ;
			var tmpCat = typeData.buildCategories.slice();
			if (tmpCat[0] == 'All Buildings') {
				tmpCat.shift()
			}
			tmpCat.toString();
			itemData.desc += ' - ' + tmpCat;

		} else if (typeName == 'Vehicle') {
			itemData.desc += '';
		} else if (typeName == 'Technology') {
			if (itemData.color == '#000000') {
				itemData.color = '#9b59b6';
			}
		} else {
			itemData.desc += ' unknown type';
		}

		itemSmallInfo.push(itemData);
	}

	function addLink(src, dst, type, srctype, dsttype) {
		for (var i = 0; i < itemLinks.length; i++) {
			if (itemLinks[i].src == src && itemLinks[i].dst == dst && itemLinks[i].type == type)
				return;
		};
		itemLinks.push({src: src, dst: dst, type:type, srctype:srctype, dsttype:dsttype});
	}

	function addItem(itemData, type) {
		var itemData = itemData || {error: true};
		var type     = type || 'unknown';
		var tmpItem  = {
			name: itemData.name,
			className: identify(itemData.name),
			type: type,
			subtype: [],
			cost: {},
			image: '',
			tileWidth: -1,
			tileHeight: -1,
			tileSize: -1,
			requiresStage: {
				display: '-1',
				raw: -1
			},
			requiresTech: null,
			reqIndependence: false,
			buildCategoriesObj: null
		};
		if (type == 'building') {
			if (itemData.buildCategories)
				tmpItem['buildCategoriesObj']   = itemData.buildCategories;
			if (itemData.transModeColor) {
				tmpItem['transModeColor']       = itemData.transModeColor;
			} else {
				tmpItem['transModeColor']       = '#c0392b';
			}

			if (itemData.passable == true) {
				/* Pavement */
				tmpItem.type                 = 'pavement';
				tmpItem['transModeColor']       = '#3c4a59';
				tmpItem['driveSpeedMod']        = itemData.driveSpeedMod;
				/* End Pavement */
			} else {
				/* Building */
				if (itemData.stores) {
					tmpItem.subtype.push('storage');
					tmpItem['storesObj']          = {};
					for (var i = itemData.stores.length - 1; i >= 0; i--)
						tmpItem.storesObj[itemData.stores[i].resource] = itemData.stores[i].amount;
				}
				if (itemData.generates) {
					tmpItem['generates']          = itemData.generates;
					tmpItem['generateTime']       = itemData.generateTime;
					tmpItem['generateAmount']     = itemData.generateAmount;
				}
				if (itemData.smelts)
					tmpItem['smeltssObj']         = itemData.smelts;
				if (itemData.refines) {
					tmpItem['refinesObj']            = [];
					for (var i = itemData.refines.length - 1; i >= 0; i--)
						tmpItem.refinesObj.push(itemData.refines[i].output);
				}
				if (itemData.providesUtility) {
					tmpItem['providesUtilityObj'] = {};
					for (var i = itemData.providesUtility.length - 1; i >= 0; i--)
						tmpItem.providesUtilityObj[itemData.providesUtility[i].utility] = itemData.providesUtility[i].amount;
				}
				if (itemData.providesShelter)
					tmpItem['providesShelter']    = itemData.providesShelter;
				if (itemData.entertains) {
					tmpItem['entertains']         = itemData.entertains;
					tmpItem['entertainmentCost']  = itemData.entertainmentCost;
				}
				if (itemData.takesTourists) {
					tmpItem['takesTourists']      = itemData.takesTourists;
					tmpItem['entertainmentCost']  = itemData.entertainmentCost;
				}
				if (itemData.produces)
					tmpItem['producesObj']        = itemData.produces;
				if (itemData.requiresUtility) {
					tmpItem['requiresUtilityObj'] = {};
					for (var i = itemData.requiresUtility.length - 1; i >= 0; i--)
						tmpItem.requiresUtilityObj[itemData.requiresUtility[i].utility] = itemData.requiresUtility[i].amount;
				}
				if (itemData.requiresFuel)
					tmpItem['requiresFuelObj']    = itemData.requiresFuel;
				if (itemData.acceptsWorkers)
					tmpItem['acceptsWorkers']     = itemData.acceptsWorkers;
				if (itemData.occupation)
					tmpItem['occupation']         = itemData.occupation;
				if (itemData.buildLimit > 0)
					tmpItem['buildLimit']         = itemData.buildLimit;

				if (itemData.canImport)
					tmpItem['canImportObj']       = itemData.canImport;

				tmpItem['requiresWorkers']    = itemData.requiresWorkers;
				/* End Building */
			}

			if (itemData.sellValue) {
				tmpItem['sellValue']           = {};
				for (var i = itemData.sellValue.length - 1; i >= 0; i--)
					tmpItem.sellValue[itemData.sellValue[i].resource] = itemData.sellValue[i].amount;
			}
			tmpItem.tileWidth                = itemData.tileWidth;
			tmpItem.tileHeight               = itemData.tileHeight;
			tmpItem.tileSize                 = itemData.tileWidth * itemData.tileHeight;
			
			tmpItem['earthTaxValue']         = itemData.earthTaxValue;
			tmpItem.image                    = itemData.indicator;
		} else if (type == 'vehicle') {
			tmpItem['transModeColor']       = '#000000';
			tmpItem.image                    = itemData.indicator;
			tmpItem['producesObj']           = itemData.produces;
			if (itemData.sellValue) {
				tmpItem['sellValue']           = {};
				for (var i = itemData.sellValue.length - 1; i >= 0; i--)
					tmpItem.sellValue[itemData.sellValue[i].resource] = itemData.sellValue[i].amount;
			}
			tmpItem['harvests']              = itemData.harvests;
			tmpItem['capacity']              = itemData.capacity;
		} else if (type == 'technology') {
			tmpItem['transModeColor']       = '#ab69c6';
			tmpItem.image                    = itemData.icon;
		} else if (type == 'terrain') {

		}

		/* Common properties */
		if (itemData.cost)
			for (var i = itemData.cost.length - 1; i >= 0; i--)
				tmpItem.cost[itemData.cost[i].resource] = itemData.cost[i].amount;
		tmpItem.requiresStage.display    = 'Stage '+itemData.requiresStage;
		tmpItem.requiresStage.raw        = itemData.requiresStage;
		tmpItem.requiresTech             = itemData.requiresTech;
		tmpItem.reqIndependence          = itemData.reqIndependence;
		tmpItem.requiPremium             = itemData.requiPremium;
		/* Add links between items */
		if (itemData.canUpgradeTo) {
			if (typeof itemData.canUpgradeTo === 'object')
				for (var i = itemData.canUpgradeTo.length - 1; i >= 0; i--)
					addLink(itemData.name, itemData.canUpgradeTo[i], 'upgradeTo', type, type);
			else 
				addLink(itemData.name, itemData.canUpgradeTo, 'upgradeTo', type, type);
		}
		if (itemData.requiresTech)
			for (var i = 0; i < itemData.requiresTech.length; i++)
				addLink(itemData.requiresTech[i], itemData.name, 'neededFor', 'technology', type);
		if (itemData.produces)
			for (var i = 0; i < itemData.produces.length; i++) {
				var dsttype = itemSmallInfo.filter(function( obj ) {return obj.label == itemData.produces[i];});
				addLink(itemData.name, itemData.produces[i], 'canBuild', type, dsttype.length ? dsttype[0].type.toLowerCase() : 'undefined');
			}

		items.push(tmpItem);
	}

	var meta = {
		dataVersion: window.ColonyGame.meta.buildVersion,
		imgSource:   'https://www.apewebapps.com/apps/my-colony/'+window.ColonyGame.meta.buildVersion+'/images/'
	};

	//add techs
	$.each(window.ColonyGame.technology, function(index, obj) {
		addItem(obj, 'technology');
		addDataToList('technology', obj);
	});
	//add buildings
	$.each(window.ColonyGame.buildings, function(index, obj) {
		addItem(obj, 'building');
		addDataToList('building', obj);
	});
	//add vehicles
	$.each(window.ColonyGame.vehicles, function(index, obj) {
		addItem(obj, 'vehicle');
		addDataToList('vehicle', obj);
	});

	var stageBG = ['#95a5a6', '#1abc9c', '#2ecc71', '#3498db'];


	function formatProperty(propertyType, propertyData, orientation) {
		var propertyType = propertyType || 'unknown';
		var orientation = orientation || 'vertical';

		var tHtml = '';

		/* property specific formattage */

		/* Caracteristics */
		if (propertyType == 'tilesize' && propertyData)
			tHtml += '<dt>Tile size </dt><dd>' + propertyData.tileSize+ ' (' + propertyData.tileWidth + 'x' + propertyData.tileHeight + ')</dd>';


		if (propertyType == 'buildLimit' && propertyData)
			tHtml += '<dt>Building limited to </dt><dd>' + propertyData+ '</dd>';
		if (propertyType == 'occupation' && propertyData)
			tHtml += '<dt>Workers\' occupation</dt><dd>' + propertyData+ '</dd>';
		if (propertyType == 'requiresWorkers' && typeof(propertyData) !== 'undefined')
			tHtml += '<dt>Worker needed to operate</dt><dd>' + (propertyData == true ? 'Yes' : 'No' ) + '</dd>';
		if (propertyType == 'acceptsWorkers' && propertyData)
			tHtml += '<dt>Workers</dt><dd class="worker">' + propertyData+ '</dd>';
		if (propertyType == 'driveSpeedMod' && propertyData)
			tHtml += '<dt>Vehicle Speed</dt><dd>' + propertyData+ '</dd>';
		if (propertyType == 'storesObj' && propertyData)
			for (resource in propertyData)
				tHtml += '<dt>Max ' + resource + '</dt><dd class="store">+' + propertyData[resource] + '</dd>';
		if (propertyType == 'providesShelter' && propertyData)
			tHtml += '<dt>Max Colonist</dt><dd>+' + propertyData + '</dd>';
		if ((propertyType == 'entertains' || propertyType == 'takesTourists') && propertyData.entertainmentCost) {
			if (propertyData.entertains)
				tHtml += '<dt>Guests</dt><dd class="guest">' + propertyData.entertains + ' Guests</dd>';
			if (propertyData.takesTourists)
				tHtml += '<dt>(Max) Tourists</dt><dd class="guest">' + propertyData.takesTourists + ' Tourists</dd>';
			tHtml += '<dt>Admission fee</dt><dd class="generate">$' + propertyData.entertainmentCost + '</dd>';
		}
		if (propertyType == 'providesUtilityObj' && propertyData)
			for (resource in propertyData)
				tHtml += '<dt>Max ' + resource + '</dt><dd class="store">+' + propertyData[resource] + '</dd>';
		if (propertyType == 'generate' && propertyData.generates) {
			tHtml += '<h4>Resource produced</h4>';
			tHtml += '<dt>' + propertyData.generates + '</dt><dd class="generate">+' + propertyData.generateAmount + ' /round</dd>';
			tHtml += '<dt>Round duration</dt><dd>' + propertyData.generateTime + ' ticks</dd>';
			if (propertyData.requiresWorkers) {
				tHtml += '<dt>Worker-Round</dt><dd>' + (Math.round(propertyData.generateTime / propertyData.acceptsWorkers * 100) / 100) + ' ticks</dd>';
				tHtml += '<dt>' + propertyData.generates + ' / W-R</dt><dd class="generate">' + (Math.round(propertyData.generateAmount/(propertyData.generateTime / propertyData.acceptsWorkers) * 100000) / 100000) + ' /tick</dd>';
			} else {
				tHtml += '<dt>' + propertyData.generates + ' / Tick</dt><dd class="generate">' + (Math.round(propertyData.generateAmount/propertyData.generateTime * 100000) / 100000) + '</dd>';
			}
			$('#generateorsmelt').show();
		}
		if (propertyType == 'smeltssObj' && propertyData.smeltssObj) {
			tHtml += '<h4>Resource transformed</h4>';
			tHtml += '<dt>Smelt ' + propertyData.smeltssObj.input + '</dt><dd class="consume">1</dd>';
			tHtml += '<dt>Into ' + propertyData.smeltssObj.output + '</dt><dd class="generate">' + propertyData.smeltssObj.ratio + ' /round</dd>';
			tHtml += '<dt>Round duration</dt><dd>' + propertyData.smeltssObj.time + ' ticks</dd>';
			if (propertyData.requiresWorkers) {
				tHtml += '<dt>Worker-Round</dt><dd>' + (Math.round(propertyData.smeltssObj.time / propertyData.acceptsWorkers * 100) / 100) + ' ticks</dd>';
				tHtml += '<dt>' + propertyData.smeltssObj.output + ' / W-R</dt><dd class="generate">' + (Math.round(propertyData.smeltssObj.ratio/(propertyData.smeltssObj.time / propertyData.acceptsWorkers) * 100000) / 100000) + ' /tick</dd>';
			} else {
				tHtml += '<dt>' + propertyData.smeltssObj.output + ' / Tick </dt><dd class="generate">' + (Math.round(propertyData.smeltssObj.ratio/propertyData.smeltssObj.time * 100000) / 100000) + '</dd>';
			}
			$('#generateorsmelt').show();
		}
		if (propertyType == 'refinesObj' && propertyData) {
			tHtml += '<dt>Resource';
			if (propertyData.length > 1)
				tHtml += 's';
			tHtml +=' processed (Refines)</dt><dd>';
			for (var i = 0; i < propertyData.length; i++) {
				if (i > 0)
					tHtml += ', ';
				tHtml += '<span class="processed">' + propertyData[i] + '</span>';
			};
			tHtml += '</dd>';

			$('#generateorsmelt').show();
		}
		if (propertyType == 'harvests' && propertyData.harvests) {
			tHtml += '<dt>Harvests</dt><dd class="harvest">' + propertyData.harvests + '</dd>';
			tHtml += '<dt>Capacity</dt><dd class="store">' + propertyData.capacity + '</dd>';
		}
		if (propertyType == 'requiresUtilityObj' && typeof(propertyData) !== 'undefined') {
			for (resource in propertyData)
				tHtml += '<dt>' + resource + '</dt><dd class="consume">-' + propertyData[resource] + '</dd>';
			$('#utility-header').show();
		}
		if (propertyType == 'requiresFuelObj' && typeof(propertyData) !== 'undefined') {
			tHtml += '<dt>' + propertyData.resource + '</dt><dd class="consume">-1 /round</dd>';
			tHtml += '<dt>Round duration</dt><dd>' + propertyData.rate + ' /ticks</dd>';
			$('#utility-header').show();
			$('#generateorsmelt').show();
		}
		if (propertyType == 'earthTaxValue' && typeof(propertyData) !== 'undefined')
			tHtml += '<dt>Motherland Tax</dt><dd class="consume">-$' + propertyData + '</dd>';


		/* Requirements */
		if (propertyType == 'requiresStage' && propertyData.raw != 99)
			tHtml += '<dt>' + propertyData.display + '</dt><dd>' + (stages[propertyData.raw] != undefined ? stages[propertyData.raw] + ' Atmosphere' : '') + '</dd>';
		if (propertyType == 'reqIndependence')
			tHtml += '<dt>Independence</dt><dd>' + (propertyData == false ? ' Not required</dd>' : ' Required</dd>');
		if (propertyType == 'requiresTech' && propertyData) {
			tHtml += '<dt>Technologies required</dt><dd>'
			for (var i = propertyData.length - 1; i >= 0; i--) {
				if (i != propertyData.length - 1)
					tHtml += '<br>';
				tHtml += '<a class="item-details-link" href="#' + identify(propertyData[i]) + '">' + propertyData[i] + '</a>';
			};
			tHtml += '</dd>';
		}
		/* Build Costs */
		if (propertyType == 'cost' && propertyData)
			for (resource in propertyData)
				tHtml += '<dt>' + resource + '</dt><dd class="consume">-' + propertyData[resource] + '</dd>';
		if (propertyType == 'sellValue' && propertyData) {
			for (resource in propertyData)
				tHtml += '<dt>' + resource + '</dt><dd class="generate">' + propertyData[resource] + '</dd>';
			$('#sell-header').show();
		}
		/* Links */
		if (propertyType == 'links' && propertyData) {
			var bfHtml = '';
			for (var i = itemLinks.length - 1; i >= 0; i--)
				if (propertyData.name == itemLinks[i].dst && 'canBuild' == itemLinks[i].type)
					bfHtml += '<a class="item-details-link" href="#' + identify(itemLinks[i].src) + '"">' + itemLinks[i].src + '</a><br>';
			if (bfHtml.length) {
				tHtml += '<dt>Built from</dt><dd>' + bfHtml + '</dd>';
				$('#links-header').show();
			}

			// upgrade from
			for (var i = itemLinks.length - 1; i >= 0; i--)
				if (propertyData.name == itemLinks[i].dst && 'upgradeTo' == itemLinks[i].type) {
					tHtml += '<dt>Upgrade from</dt><dd><a class="item-details-link" href="#' + identify(itemLinks[i].src) + '"">' + itemLinks[i].src + '</a></dd>';
					$('#links-header').show();
				}
			// upgrade to
			for (var i = itemLinks.length - 1; i >= 0; i--)
				if (propertyData.name == itemLinks[i].src && 'upgradeTo' == itemLinks[i].type) {
					tHtml += '<dt>Upgrade to</dt><dd><a class="item-details-link" href="#' + identify(itemLinks[i].dst) + '"">' + itemLinks[i].dst + '</a></dd>';
					$('#links-header').show();
				}
			// needed for
			var nfHtml = '';
			for (var i = itemLinks.length - 1; i >= 0; i--)
				if (propertyData.name == itemLinks[i].src && 'neededFor' == itemLinks[i].type)
					nfHtml += '<a class="item-details-link" href="#' + identify(itemLinks[i].dst) + '"">' + itemLinks[i].dst + '</a><br>';
			if (nfHtml.length) {
				tHtml += '<dt>Needed for</dt><dd>' + nfHtml + '</dd>';
				$('#links-header').show();
			}
		}
		/* Can build */
		if (propertyType == 'producesObj' && propertyData) {
			tHtml += '<dt>Can build</dt><dd>'
			for (var i = propertyData.length - 1; i >= 0; i--) {
				if (i != propertyData.length - 1)
					tHtml += '<br>';
				tHtml += '<a class="item-details-link" href="#' + identify(propertyData[i]) + '">' + propertyData[i] + '</a>';
			};
			tHtml += '</dd>';
		}


		/* End of the property */
		if (tHtml.length == 0)
			return tHtml;
		if (orientation == 'vertical')
			tHtml = '<dl class="item-property">' + tHtml;
		else
			tHtml = '<dl class="dl-horizontal item-property">' + tHtml;
		tHtml += '</dl>';
		return tHtml;
	}

	function printDescription(className) {
		var className = className || 'unknown';
		for (var i = items.length - 1; i >= 0; i--) {
			if (className == items[i].className) {
				console.log('found item', items[i]);
				var descData = items[i];
				$('#item-image').attr('src', meta.imgSource + descData.image);
				var thisName = descData.name + ' <small>';
				if (descData.requiPremium == true)
					thisName += '<span class="premium">Premium</span> ';
				thisName += descData.type + '</small>'
				$('#item-name').html(thisName);
				if (descData.type == 'building' || descData.type == 'pavement') {
					$('#item-requirements-tilesize .item-properties').html(formatProperty('tilesize', descData, 'h'));
				}
				/* Caracteristics */
				$('#item-requirements-buildlimit .item-properties').html(formatProperty('buildLimit', descData.buildLimit));
				$('#item-requirements-occupation .item-properties').html(formatProperty('occupation', descData.occupation));
				$('#item-requirements-workerneeded .item-properties').html(formatProperty('requiresWorkers', descData.requiresWorkers));
				$('#item-requirements-workers .item-properties').html(formatProperty('acceptsWorkers', descData.acceptsWorkers, 'h'));
				$('#item-requirements-drivespeed .item-properties').html(formatProperty('driveSpeedMod', descData.driveSpeedMod, 'h'));
				$('#item-requirements-storage .item-properties').html(formatProperty('storesObj', descData.storesObj, 'h'));
				/*$('#item-requirements-capacity .item-properties').html(formatProperty('capacity', descData.capacity, 'h'));*/
				$('#item-requirements-provideshelter .item-properties').html(formatProperty('providesShelter', descData.providesShelter, 'h'));
				$('#item-requirements-entertain .item-properties').html(formatProperty('entertains', descData, 'h'));
				$('#item-requirements-entertain .item-properties').html(formatProperty('takesTourists', descData, 'h'));
				$('#item-requirements-provideutility .item-properties').html(formatProperty('providesUtilityObj', descData.providesUtilityObj, 'h'));
				$('#item-requirements-generate .item-properties').html(formatProperty('generate', descData, 'h'));
				$('#item-requirements-smelt .item-properties').html(formatProperty('smeltssObj', descData, 'h'));
				$('#item-requirements-refines .item-properties').html(formatProperty('refinesObj', descData.refinesObj));
				$('#item-requirements-harvestkappa .item-properties').html(formatProperty('harvests', descData, 'h'));
				$('#item-requirements-requtility .item-properties').html(formatProperty('requiresUtilityObj', descData.requiresUtilityObj, 'h'));
				$('#item-requirements-reqfuel .item-properties').html(formatProperty('requiresFuelObj', descData.requiresFuelObj, 'h'));
				$('#item-requirements-tax .item-properties').html(formatProperty('earthTaxValue', descData.earthTaxValue, 'h'));

				/* Requirements*/
				$('#item-requirements-stage .item-properties').html(formatProperty('requiresStage', descData.requiresStage));
				$('#item-requirements-independence .item-properties').html(formatProperty('reqIndependence', descData.reqIndependence));
				$('#item-requirements-tech .item-properties').html(formatProperty('requiresTech', descData.requiresTech));
				/* Build Cost */
				$('#item-requirements-buildcost .item-properties').html(formatProperty('cost', descData.cost, 'h'));
				$('#item-requirements-sell .item-properties').html(formatProperty('sellValue', descData.sellValue, 'h'));
				/* Links */
				$('#item-links-links .item-properties').html(formatProperty('links', descData));
				/* Can build */
				$('#item-links-canbuild .item-properties').html(formatProperty('producesObj', descData.producesObj));
			}
		};
	}


	/* name = item name */
	function linkTo(name, type) {
		console.log(name, type);
		return '<a class="opendesc" href="#' + type + '-' + identify(name) + '">' + name + '</a>';
	}

	/* update url */
	function updateUrlParameter(uri, key, value) {
		// remove the hash part before operating on the uri
		var i = uri.indexOf('#');
		var hash = i === -1 ? ''  : uri.substr(i);
		uri = i === -1 ? uri : uri.substr(0, i);

		var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		var separator = uri.indexOf('?') !== -1 ? "&" : "?";

		if (!value) {
			// remove key-value pair if value is empty
			uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');
			if (uri.slice(-1) === '?') {
				uri = uri.slice(0, -1);
			}
			// replace first occurrence of & by ? if no ? is present
			if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
		} else if (uri.match(re)) {
			uri = uri.replace(re, '$1' + key + "=" + value + '$2');
		} else {
			uri = uri + separator + key + "=" + value;
		}
		return uri + hash;
	}
	function updateURL(key,value) {
		window.history.pushState(
			"object or string", 
			"My Colony Reference - Building, Vehicles &amp; Researchs", 
			updateUrlParameter(window.location.href, encodeURI(key), encodeURI(value)));
	}

	/* get the URL search variable and convert to object */
	function searchToObject() {
		var pairs = window.location.search.substring(1).split("&"),
			obj = {},
			pair,
			i;

		for ( i in pairs ) {
			if ( pairs[i] === "" ) continue;

			pair = pairs[i].split("=");
			obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
		}

		return obj;
	}
	var searchObj = searchToObject();
	$(document).ready(function() {
		$('#version-number').append(" "+meta.dataVersion);
		/*console.log(items);
		console.log(itemLinks);*/
		$('#examplett').DataTable({
			dom: '<"top">rt<"bottom"ip><"clear">',
			hideEmptyCols: true,
			lengthChange: true,
			paging: true,
			pageResize: true,
			scrollX: true,
			fixedColumns: {
				leftColumns: 2,
				rightColumns: 1
			},
			data: items,
			columns: [
				{ /* 0 (Col 1) */
					data: null,
					searchable: false,
					orderable: false,
					className:      'row-index',
					width: "1em",
					targets: 0
				},
				{ /* 1 (Col 2) */
					name: "Name", data: "name" },
				{ /* 2 (Col 3) */
					name: "Type", ddata: "type" },
				{ /* 3 (Col 4) */
					name: "Stage", data: "requiresStage.raw",
				},
				{ /* 4 (Col 5) */
					name: "Independence", data: "reqIndependence"
				},
				{ /* 4 (Col 5) */
					name: "BuildingCategories", data: "buildCategoriesObj"
				},
				{ /* 5 (Col 6) */
					name: "crMoney", data: "cost.Money", render: $.fn.dataTable.render.number( ',', '.', 0, '$ ')
				},
				{ /* 6 (Col 7) */
					name: "crFood", data: "cost.Food", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'f')
				},
				{ /* 7 (Col 8) */
					name: "crWater", data: "cost.Water", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'w')
				},
				{ /* 8 (Col 9) (Added in 0.3.0) */
					name: "crHelium3", data: "cost.Helium 3", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'he')
				},
				{ /* 9 (Col 10) */
					name: "crRum", data: "cost.Rum", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'ru')
				},
				{ /* 10 (Col 11) */
					name: "crWood", data: "cost.Wood", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'wo')
				},
				{ /* 11 (Col 12) (Added in 0.3.0) */
					name: "crCharcoal", data: "cost.Charcoal", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'ch')
				},
				{ /* 12 (Col 13) */
					name: "crOre", data: "cost.Ore", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'o')
				},
				{ /* 13 (Col 14) (Added in 0.3.0) */
					name: "crRegolith", data: "cost.Regolith", render: $.fn.dataTable.render.number( ',', '.', 0, '', 're')
				},
				{ /* 14 (Col 15) */
					name: "crClay", data: "cost.Clay", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'c')
				},
				{ /* 15 (Col 16) */
					name: "crWool", data: "cost.Wool", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'wl')
				},
				{ /* 16 (Col 17) */
					name: "crSteel", data: "cost.Steel", render: $.fn.dataTable.render.number( ',', '.', 0, '', 's')
				},
				{ /* 17 (Col 18) (Added in 0.3.0) */
					name: "crOil", data: "cost.Oil", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'oi')
				},
				{ /* 18 (Col 19) */
					name: "crGold", data: "cost.Gold", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'g')
				},
				{ /* 19 (Col 20) */
					name: "crAluminium", data: "cost.Aluminium", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'al')
				},
				{ /* 20 (Col 21) */
					name: "crUranium", data: "cost.Uranium", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'u')
				},
				{ /* 21 (Col 22) */
					name: "crPottery", data: "cost.Pottery", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'p')
				},
				{ /* 22 (Col 23) (Added in 0.3.0) */
					name: "crPlastic", data: "cost.Plastic", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'p')
				},
				{ /* 23 (Col 24) */
					name: "crBricks", data: "cost.Bricks", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'b')
				},
				{ /* 24 (Col 25) */
					name: "crCloth", data: "cost.Cloth", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'cl')
				},
				{ /* 25 (Col 26) (Added in 0.3.0) */
					name: "crToy", data: "cost.Toy", render: $.fn.dataTable.render.number( ',', '.', 0, '', 't')
				},
				{ /* 26 (Col 27) */
					name: "crMicrochip", data: "cost.Microchip", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'm')
				},
				{ /* 27 (Col 28) */
					name: "crAtmosphere", data: "cost.Atmosphere", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'a')
				},
				{ /* 28 (Col 29) */
					name: "crResearch", data: "cost.Research", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'r')
				},
				{ /* 29 (Col 30) */
					name: "crCivics", data: "cost.Civics", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'c')
				},
				{ /* 30 (Col 31) */
					name: "crAlienArtifact", data: "cost.Alien Artifact", render: $.fn.dataTable.render.number( ',', '.', 0, '', 'ar')
				},
				{ /* XX (Last Col) */
					data: "className",
					searchable: false,
					orderable: false,
					className:      'details-control',
					defaultContent: ''
				}
			], 
			order: [[ 3, 'asc' ], [ 1, 'asc' ]],
			aoColumnDefs: [
				{
					"aTargets": [1],
					"mData": "name",
					"mRender": function ( data, type, full ) {
						var thisName = '<span style="border-left: 6px solid ' + full.transModeColor + '; padding-left: 5px;">'+data+'</span>';
						if (full.requiPremium == true)
							thisName += ' <span class="glyphicon glyphicon-star premium" aria-hidden="true" title="Premium Item"><span class="premium-text">Premium</span></span>';
						return thisName;
					}
				},
				{
					"aTargets": [2],
					"mData": "type",
					"mRender": function ( data, type, full ) {
						return '<a class="tofilter" href="#">'+data.toLowerCase().replace(/\b[a-z]/g, function(letter) {
							return letter.toUpperCase();
						})+'</a>';
					}
				},
				{
					"aTargets": [3],
					"mData": "requiresStage",
					"mRender": function ( data, type, full ) {
						/*return '<a class="tofilter stage-'+full.requiresStage.raw+'" href="#">'+full.requiresStage.display+'</a>';*/
						return full.requiresStage.display;
					}
				},
				{
					"aTargets": [4],
					"mData": "reqIndependence",
					"mRender": function ( data, type, full ) {
						return data == true ? "Yes" : "No";
					}
				},
				{
					"aTargets": [5],
					"mData": "buildCategoriesObj",
					"mRender": function ( data, type, full ) {
						var text = '';
						if (data && typeof data === 'object') {
							for (var i = 0; i < data.length; i++) {
								if (i > 0)
									text += ', ';
								text += '<span>'+data[i]+'</span>';
							};
						}
						
						return text;
					}
				},
				{
					"aTargets": [32],
					"mData": "name",
					"mRender": function ( data, type, full ) {
						return '<a class="item-details-link" href="#'+data+'">Details</a>';
					}
				},
				{ 
					"sType": "numeric", 
					"sClass": "currency",
					"defaultContent": '',
					"aTargets": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,31 ]
				}
			],
			initComplete: function(settings, json) {
				/* Show the table after everything is loaded*/
				$( "#loading-overlay" ).hide( "fast" );

				/* Open Item Description if hash on url */
				if (window.location.hash) {
					console.log(window.location.hash);
					var className = window.location.hash.substring(1);
					openItemDesc(className);
				}

				/* Set the search field if in URL */
				if (searchObj['search']) {
					setSearchVal(decodeURI(searchObj['search']));
					this.api().search(decodeURI(searchObj['search'])).draw();
				}
			}
		});

		/* Open Item Description */
		function openItemDesc(className) { 
			var className = className || null;
			$('.item-properties').html('');
			$('#utility-header').hide();
			$('#generateorsmelt').hide();
			$('#canbuild-header').hide();
			$('#sell-header').hide();
			$('#links-header').hide();

			printDescription(className);
			if ($("#item-description").is(":visible")) {
				$('html, body').animate({
					scrollTop: $("#item-description").offset().top -20
				}, 600);
			} else {
				$( "#item-description" ).show( "slow" );
			}
		};
		$(document).on('click', 'a.item-details-link', function(){
			var className = $(this).attr('href').substring(1);
			openItemDesc(className);
		});
		/* Close Item Description */
		$(document).on('click', 'a.item-details-close', function() { 
			$( "#item-description" ).hide( "slow" );
		});

		oTable = $('#examplett').DataTable();   //pay attention to capital D, which is mandatory to retrieve "api" datatables' object, as @Lionel said
		/* Initialize filters */
		yadcf.init(oTable, [/*
			{column_number : 0 },
			{column_number : 1 },*/
			{column_number : 2, filter_type: 'select', filter_default_label: 'All Types', filter_reset_button_text: false},
	    	{column_number : 3, filter_type: 'select', filter_default_label: 'All Stages', filter_reset_button_text: false},
	    	{column_number : 4, data: ["Yes", "No"], filter_type: 'select', filter_default_label: 'Independence', filter_reset_button_text: false},
	    	{column_number : 5, text_data_delimiter: ",", filter_default_label: "Categories", filter_reset_button_text: false}
	    	], {filters_position: "footer", filters_tr_index: 1});
		/* Table: add an index for each row */
		oTable.on( 'order.dt search.dt', function () {
			oTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
				cell.innerHTML = i+1;
			} );
		} ).draw();
		
		if (searchObj) {
			var presetFilters = [];
			for (var filterName in searchObj){
				if (filterableColumnNames.indexOf(filterName) > -1) {
					var filterID = oTable.column(filterName+':name').index();
					presetFilters.push([filterID, searchObj[filterName]]);
				}
			}
			
			yadcf.exFilterColumn(oTable, presetFilters);
		}

		/* Update URL when filter selection */
		$(document).on('change', 'select.yadcf-filter', function() { 
			var colID = $(this).attr('id');
			colID = colID.replace('yadcf-filter--examplett-', '');
			var columns = oTable.settings().init().columns;
			var columnFilterName = columns[colID].name;
			var columnFilterVal = yadcf.exGetColumnFilterVal(oTable,colID);
			updateURL(columnFilterName, columnFilterVal);
		});

		/* Add a button to clear filters */
		$(document).on('click', 'button#clearf', function() { 
			yadcf.exResetAllFilters(oTable);
			if (searchObj['search']) {
				oTable.search(searchObj['search']).draw();
			}
			
			for (var i = 0; i < filterableColumnNames.length; i++) {
				updateURL(filterableColumnNames[i], '');
			};
		});

		$(document).on('click', 'a.tofilter', function() { 
			var searchval = $(this).text();
			if (searchval == 'All')
				searchval = '';
			else
				searchval = '"'+searchval+'"';
			setSearchVal(searchval);
			$('#searchdatalist').trigger('input');
			$( "#item-description" ).hide( "slow" );
		});

		function setSearchVal(searchval) {
			$("#searchdatalist").val(searchval);
		}
		$('#searchdatalist').on('input', function() {
			// add search filter
			updateURL('search', $(this).val());
			oTable.search($(this).val()).draw();
		});

		
	});
}
