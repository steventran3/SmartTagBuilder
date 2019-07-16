/**
 * SmartTag Builder
 * Created: February 8, 2015
 * Developed with WebStorm
 *
 * @author
 * Dom Toliver <dtoliver@rubiconproject.com>
 *
 * @version
 * 0.5.1 (March 15, 2015)
 *
 * @copyright
 * Copyright © 2015 Dom Toliver
 */

var masterTagArray = [];
var zoneNames = [];
var lastTag = new Tag(null, null, null, null, null, null, null);
var loadedFileNames = [];
var tab = '    '; // 4 spaces
var tab2 = tab + tab; // 8 spaces
var tab3 = tab + tab + tab; // 12 spaces
var editModal = document.getElementsByClassName('modal').item(0);

function dq(query) {
    return document.querySelector(query);
}

function dqa(query) {
    return document.querySelectorAll(query);
}


/***
 * HANDLE TAG IMPORT
 ***/

var fileArea = dq('#file-area');
var input = fileArea;
var reader = new FileReader();
var tagResults = [];
var tagList = [];

function handleFileSelect(event) {
    var file = event.target.files[0];
    var loadedFiles = loadedFileNames;
    var tagIsLoaded = false;

    if (loadedFiles.length == 0) {
        loadedFiles.push(file.name);
        reader.readAsText(file);
    } else {
        for (i = 0; i < loadedFiles.length; i++) {
            if (loadedFiles[i] == file.name) {
                tagIsLoaded = true;
            }
        }

        if (tagIsLoaded) {
            window.alert('Tag is already loaded.\r\n( ' + file.name + ' )');
        } else {
            loadedFiles.push(file.name);
            reader.readAsText(file);
        }
    }
}

reader.onload = function(){
    tagResults = reader.result;
    var tagSplit = tagResults.split(/(<!--\s+Begin Rubicon Project Tag\s+-->)/);

    if (tagList.length > 0) {
        tagList = [];
    }

    for (i = 1; i < tagSplit.length; i++) {
        if (i % 2 == 0) {
            var text = "<!--  Begin Rubicon Project Tag -->\r\n";
            tagList.push(text + tagSplit[i].trim());
        }
    }
    createTagObjectFromTags(tagList);
};

/*******-!-******/



/***
 * HANDLE TAG EXPORT
 ***/

function exportTags(tags) {
    var text = "";
    var tagOutput = "";
    var tagCount = 0;
    for (i = 0; i < tags.length; i++) {
        if (tags[i].isComplete && tags[i].isChecked) {
            var tag = tags[i];
            var acceptAPI = (tag.rpx_params.accept.apis) ? tag.rpx_params.accept.apis : "[]";
            var inv = (tag.rpx_params.i != "") ? tag.rpx_params.i : '{\r\n'+tab3+'//key1 : \'value1,value2\',\r\n'+tab3+'//key2 : \'value1,value2\'\r\n'+tab2+'}';
            var vis = (tag.rpx_params.v != "") ? tag.rpx_params.v : '{\r\n'+tab3+'//key1 : \'value1,value2\',\r\n'+tab3+'//key2 : \'value1,value2\'\r\n'+tab2+'}';
            var placement = (tag.placement != "") ? '<!--  PLACEMENT: '+tag.placement+'   -->\r\n<scr' + 'ipt>\r\n' : "<scr" + "ipt>\r\n";

            text = "<!--  Begin Rubicon Project Tag  -->\r\n" +
            "<!--  Site: " + tag.site + "    Zone: " + tag.zone + "    Size: " + tag.size + "  -->\r\n" +
            placement + tab +
            "var rpx_params = {\r\n" + tab2 +
            "app : {\r\n" + tab3 +
            "name : '" + tag.rpx_params.app.name + "',\r\n" + tab3 +
            "domain : '" + tag.rpx_params.app.domain + "',\r\n" + tab3 +
            "bundle : '" + tag.rpx_params.app.bundle + "',\r\n" + tab3 +
            "ver : '" + tag.rpx_params.app.ver + "',\r\n" + tab3 +
            "privacypolicy : '" + tag.rpx_params.app.privacypolicy + "',\r\n" + tab3 +
            "storerating : '" + tag.rpx_params.app.storerating + "',\r\n" + tab3 +
            "storeurl : '" + tag.rpx_params.app.storeurl + "',\r\n" + tab3 +
            "appstoreid : '" + tag.rpx_params.app.appstoreid + "'\r\n" + tab2 +
            "},\r\n" + tab2 +
            "device : {\r\n" + tab3 +
            "make : '',\r\n" + tab3 +
            "model : '" + tag.rpx_params.device.model + "',\r\n" + tab3 +
            "pixel_ratio : '" + tag.rpx_params.device.pixel_ratio + "',\r\n" + tab3 +
            "os : '',\r\n" + tab3 +
            "osv : '',\r\n" + tab3 +
            "js : '" + tag.rpx_params.device.js + "',\r\n" + tab3 +
            "connectiontype : '"  + tag.rpx_params.device.connectiontype + "',\r\n" + tab3 +
            "carrier : '" + tag.rpx_params.device.carrier + "',\r\n" + tab3 +
            "dpid : '" + tag.rpx_params.device.dpid + "',\r\n" +tab3 +
            "dpidmd5 : '"  + tag.rpx_params.device.dpidmd5 + "',\r\n" + tab3 +
            "dpidsha1 : '" + tag.rpx_params.device.dpidsha1 + "',\r\n" + tab3 +
            "dpid_type : '" + tag.rpx_params.device.dpid_type + "'\r\n" + tab2 +
            "},\r\n" + tab2 +
            "kw : '" + tag.rpx_params.kw.replace(/\s+/g, "") + "',\r\n" + tab2 +
            "i : " + inv + ",\r\n" + tab2 +
            "v : " + vis + ",\r\n" + tab2 +
            "geo : {\r\n" + tab3 +
            "longitude : '" + tag.rpx_params.geo.longitude + "',\r\n" + tab3 +
            "latitude : '" + tag.rpx_params.geo.latitude + "',\r\n" + tab3 +
            "type : '" + tag.rpx_params.geo.type + "',\r\n" + tab3 +
            "consent : '" + tag.rpx_params.geo.consent + "'\r\n" + tab2 +
            "},\r\n" + tab2 +
            "accept : {\r\n" + tab3 +
            "apis : " + acceptAPI + "\r\n" + tab2 +
            "}\r\n" + tab +
            "};\r\n" + "</sc" + "ript>\r\n\r\n" +

            "<scr" + "ipt language=\"JavaScript\" type=\"text/javascript\">\r\n" +
            "rp_account    = '" + tag.accountId + "';\r\n" +
            "rp_site       = '" + tag.siteId + "';\r\n" +
            "rp_zonesize   = '" + tag.zoneSizeId + "';\r\n" +
            "rp_adtype     = 'js';\r\n" +
            "rp_smartfile  = '[SMART FILE URL]';\r\n" +
            "rp_app        = rpx_params.app;\r\n" +
            "rp_device     = rpx_params.device;\r\n" +
            "rp_kw         = rpx_params.kw;\r\n" +
            "rp_inventory  = rpx_params.i;\r\n" +
            "rp_visitor    = rpx_params.v;\r\n" +
            "rp_accept     = rpx_params.accept;\r\n" +
            "rp_geo        = rpx_params.geo;\r\n" +
            "</scr" + "ipt>\r\n" +
            "<scr" + "ipt type=\"text/javascript\" src=\"http://ads.rubiconproject.com/ad/" + tag.accountId + ".js\"></scr" + "ipt>\r\n" +
            "<!--  End Rubicon Project Tag -->\r\n\r\n\r\n\r\n\r\n";
            tagOutput += text;
            tagCount++;
        }
    }
    var countString = (tagCount == 1) ? tagCount + " TAG LISTED BELOW\r\n\r\n\r\n" : tagCount + " TAGS LISTED BELOW\r\n\r\n\r\n";
    return (tagOutput != "") ? countString + tagOutput : null;
}

function createBlob() {
    var tagOutput = exportTags(masterTagArray);
    var d = dq('#file-area a');

    if (tagOutput != null) {
        var blob;

        var date = new Date();

        blob = new Blob([tagOutput], {type:'text/plain;charset=UTF-8'});
        window.URL = window.URL || window.webkitURL;
        var url = window.URL.createObjectURL(blob);
        var revoke = window.URL.revokeObjectURL(blob);

        d.download = 'RevvForMobile_SmartTags_' + formatDate(date) + ".txt";
        d.target = '_blank';
        d.href = url;
        revoke;
    } else {
        d.href="#";
        d.target = null;
        alert('Please select any completed tags to view them.');
    }
}

function verifyFields() {
    var complete = true;

    var r1 = dqa('input[required]');
    for (i=0; i<r1.length; i++) {
        //Check if inputs have text.
        if (!r1[i].value) {
            r1[i].style.backgroundColor = 'rgba(207, 10, 44, 0.20)';
            complete = false;
        }
    }


    var status;
    var tr = dq('tr#' + editModal.id);
    if (complete) {
        tagsBySiteZone(editModal.dataset.site, editModal.dataset.zone).map( function(tag) {
            tag.isComplete = true;
        });
        status = tr.children[3].children[0];
        status.className = 'complete';
        status.textContent = 'COMPLETE';

        setProperties(lastTag);
        closeModal()
    } else {
        tagsBySiteZone(editModal.dataset.site, editModal.dataset.zone).map( function(tag) {
            tag.isComplete = false;
        });
        status = tr.children[3].children[0];
        status.className = 'incomplete';
        status.textContent = 'INCOMPLETE';
        alert('Incomplete fields.');
    }
}

function formatDate(d) {

    var dd = d.getDate();
    if ( dd < 10 ) dd = '0' + dd;

    var mm = d.getMonth()+1;
    if ( mm < 10 ) mm = '0' + mm;

    var yy = d.getFullYear() % 100;
    if ( yy < 10 ) yy = '0' + yy;

    return yy+'_'+mm+'_'+dd; // YY_MM_DD
}

/*******-!-******/




/***
 * MODAL - GET VALUES
 ***/

function getTextValueForId(id) {
    var v = document.getElementById(id).value;
    return (v) ? v : "";
}

function getTextAreaValueForId(id,bool) {
    var returnRawVal = false;
    var agl = arguments.length;
    var dict = '{\r\n'+tab3;
    var t = document.querySelector('#' + id + ' textarea');


    function cont() {
        if (agl == 2) {
            returnRawVal = bool;
        }

        var patt = /[\w]+\s*:\s*("|')[\w\,-.]+("|')/g;
        var match = patt.test(t.value);
        if (agl == 2 & match && returnRawVal) {
            var m = t.value.match(patt);
            for (i = 0; i < m.length; i++) {
                var a = m[i].split(':');
                dict += a[0].trim() + ' : ' + a[1].trim() + ',\r\n' + tab3;
            }
            return dict+='//key : \'value1,value2\'\r\n'+tab2+'}';
        } else {
            var d = dict + '//key1 : \'value1,value2\',\r\n' + tab3 + '//key2 : \'value1,value2\'\r\n' + tab2 + '}';
            return (t.value) ? t.value : d;
        }
    }

    var v = t.value;
    return (v) ? cont() : "";
}

function getRadioValueForName(name) {
    var radioObj = document.querySelectorAll('input[type="radio"]');
    var radioLength = radioObj.length;

    if (!radioObj || radioLength === undefined) {
        return "";
    }

    for (i = 0; i < radioLength; i++) {
        if (radioObj[i].name == name) {
            if (radioObj[i].checked) {
                var v = radioObj[i].value;
                return (v) ? v : "";
            }
        }
    }
}

function getSelectValueForId(id) {
    var selectObj = document.getElementById(id);
    if (!selectObj) {
        return "";
    }

    var optsLength = selectObj.options.length;

    for (i = 0; i < optsLength; i++) {
        if (selectObj.options[i].selected) {
            var v = selectObj.options[i].value;
            return (v) ? v : "";
        }
    }
}

/*******-!-******/




/***
 * MODAL - SET VALUES
 ***/

function setTextForID(id, text) {
    document.getElementById(id).value = (text != "''") ? text : "";
}

function setTextAreaValueForID(id, text) {
    var t = document.querySelector('#' + id + ' textarea');
    t.value = (text != "''") ? text : "";
}

function setRadioClassWithVal(className, value) {
    var radioButton;
    var rb = document.getElementsByClassName(className);

    for (i = 0; i < rb.length; i++) {
        if (rb[i].value == value) {
            radioButton = rb[i];
            radioButton.checked = true;
            break;
        }
    }
}

function setOptionIdWithVal(id, value) {
    var sel = document.getElementById(id);
    var opts = sel.options;
    for (i = 0; i < opts.length; i++) {
        var opt = opts[i];
        if (opt.value == value) {
            opt.selected = true;
            break;
        }
    }
}

/*******-!-******/




/***
 * MODAL - LOAD, SAVE, & CLOSE
 ***/

function loadModalContent(lastTag) {
    if (editModal.style.visibility == 'visible') {
        var t = tagsBySiteZone(editModal.dataset.site, editModal.dataset.zone);
        var tag = (lastTag) ? lastTag.rpx_params : t[0].rpx_params;
        setTextForID('app.name', tag.app.name);
        setTextForID('app.domain', tag.app.domain);
        setTextForID('app.bundle', tag.app.bundle);
        setTextForID('app.ver', tag.app.ver);
        setTextForID('app.storerating', tag.app.storerating);
        setRadioClassWithVal('app.privacypolicy', tag.app.privacypolicy);
        setTextForID('app.storeurl', tag.app.storeurl);
        setTextForID('app.appstoreid', tag.app.appstoreid);
        setRadioClassWithVal('accept.apis', tag.accept.apis);
        setTextForID('device.model', tag.device.model);
        setTextForID('device.pixel_ratio', tag.device.pixel_ratio);
        setTextForID('device.connectiontype', tag.device.connectiontype);
        setTextForID('device.carrier', tag.device.carrier);
        setTextForID('device.dpid', tag.device.dpid);
        setTextForID('device.dpidmd5', tag.device.dpidmd5);
        setTextForID('device.dpidsha1', tag.device.dpidsha1);
        setOptionIdWithVal('device-dpid_type', tag.device.dpid_type);
        setRadioClassWithVal('device.js', tag.device.js);
        setTextForID('geo.latitude', tag.geo.latitude);
        setTextForID('geo.longitude', tag.geo.longitude);
        setOptionIdWithVal('geo.type', tag.geo.type);
        setRadioClassWithVal('geo.consent', tag.geo.consent);
        setTextAreaValueForID('keywords', tag.kw);
        setTextAreaValueForID('inventory', tag.i_raw);
        setTextAreaValueForID('visitor', tag.v_raw);
    }
}

function setModalHeader(site,zone) {
    var siteNameLabel = dq('#sitename_label');
    var zoneNameLabel = dq('#zonename_label');

    siteNameLabel.innerHTML = '<span class="span-label">Site:</span> ' + site;
    zoneNameLabel.innerHTML = '<span class="span-label">Zone:</span> ' + zone;
}

function closeModal() {
    if (editModal.style.visibility == 'visible') {
        editModal.style.visibility = 'hidden';
    }
}

function saveAndCloseModal() {
    var tags = tagsBySiteZone(editModal.dataset.site, editModal.dataset.zone);
    if (editModal.style.visibility == 'visible') {
        tags.map(function(tag) {
            setProperties(tag);
        });
        verifyFields();
    }
}

function setCloseButtonListener() {
    var buttons = dqa('.modal-close-button');
    if (!buttons) {
        alert("setCloseButtonListener: No buttons found.");
        console.log("setCloseButtonListener: No buttons found.");
    }
    for (i = 0; i < buttons.length; i++) {
        if (buttons[i].value == 'Cancel') {
            buttons[i].addEventListener("click", closeModal, false);
        } else if (buttons[i].value == 'Save') {
            buttons[i].addEventListener("click", saveAndCloseModal, false);
        }
    }
}

/*******-!-******/




/**
 * Represents a tag.
 *
 * @class
 * @arg {string} site - The site of the RFM tag
 * @arg {string} zone - The zone of the RFM tag
 * @arg {string} size - The size description of the RFM tag
 * @arg {string} accountId - The account ID of the RFM tag
 * @arg {string} siteId - The site ID of the RFM tag
 * @arg {string} zoneSizeId - The zoneSize ID of the RFM tag
 * @arg {string} placement - The placement (if available) of the RFM tag
 */
function Tag(site, zone, size, accountId, siteId, zoneSizeId, placement) {
    this.site = site;
    this.zone = zone;
    this.size = size;
    this.placement = (placement) ? placement : "";
    this.accountId = accountId;
    this.siteId = siteId;
    this.zoneSizeId = zoneSizeId;
    this.isNew = true;
    this.isComplete = false;
    this.isChecked = false;

    this.rpx_params = {
        app: {
            name: '',
            domain: '',
            bundle: '',
            ver: '',
            privacypolicy: '',
            storerating: '',
            storeurl: '',
            appstoreid: ''
        },
        device: {
            make: '',
            model: '',
            pixel_ratio: '',
            os: '',
            osv: '',
            js: '1',
            connectiontype: '',
            carrier: '',
            dpid: '',
            dpidmd5: '',
            dpidsha1: '',
            dpid_type: ''
        },
        kw: '',
        i: '',
        i_raw: '',
        v: '',
        v_raw: '',
        geo: {
            longitude: '',
            latitude: '',
            type: '',
            consent: ''
        },
        accept: {
            apis: '[3,1000]'
        }
    };
}



function loadLastTag() {
    loadModalContent(lastTag);
}


function toggleEditModal(el) {
    var v = editModal.style.visibility = (editModal.style.visibility == "visible") ? "hidden" : "visible";

    var selectAllCheckbox = dq('input[type="checkbox"]');
    selectAllCheckbox.checked = false;

    if (v == 'visible') {
        var lastTagButton = document.getElementById('last_tag_button');
        lastTagButton.addEventListener("click", loadLastTag, false);

        //Set modal's ID to match selected table row
        var editButton = el.target;
        var editButtonSite = editButton.dataset.site;
        var editButtonZone = editButton.dataset.zone;


        editModal.id = editButton.parentElement.parentElement.id;
        editModal.dataset.site = editButtonSite;
        editModal.dataset.zone = editButtonZone;

        var tags = tagsBySiteZone(editButtonSite, editButtonZone);
        tags.map(function(tag) {
            if (tag.isNew) {
                tag.isNew = false;
            }

            if (editButtonSite == tag.site && editButtonZone == tag.zone && !tag.isComplete) {
                var trChildren = editButton.parentElement.parentElement.children;
                var status = trChildren[3].children[0];
                status.className = 'incomplete';
                status.textContent = 'INCOMPLETE';
            }
        });

        var r1 = dqa('input[required]');
        for (i=0; i<r1.length; i++) {
            r1[i].style.backgroundColor = null;
        }

        loadModalContent(null);
        setModalHeader(editButtonSite, editButtonZone);
        setCloseButtonListener();
    }
}


function setEditButtonListener() {
    var editButton = document.getElementsByName("edit-tag-button");
    for (i = 0; i < editButton.length; i++) {
        var el = editButton[i];
        el.addEventListener("click", toggleEditModal, false);
    }
}



//Set Tag Properties
function setProperties(tag) {
    var rpx = tag.rpx_params;

    rpx.app.name = getTextValueForId('app.name'); //Req
    rpx.app.domain = getTextValueForId('app.domain'); //Req
    rpx.app.bundle = getTextValueForId('app.bundle'); //Req
    rpx.app.ver = getTextValueForId('app.ver');
    rpx.app.privacypolicy = getRadioValueForName('app.privacypolicy');
    rpx.app.storerating = getTextValueForId('app.storerating');
    rpx.app.storeurl = getTextValueForId('app.storeurl'); //Req
    rpx.app.appstoreid = getTextValueForId('app.appstoreid'); //Req
    rpx.device.model = getTextValueForId('device.model');
    rpx.device.pixel_ratio = getTextValueForId('device.pixel_ratio');
    rpx.device.js = getRadioValueForName('device.js');
    rpx.device.connectiontype = getTextValueForId('device.connectiontype');
    rpx.device.carrier = getTextValueForId('device.carrier');
    rpx.device.dpid = getTextValueForId('device.dpid');
    rpx.device.dpidmd5 = getTextValueForId('device.dpidmd5');
    rpx.device.dpidsha1 = getTextValueForId('device.dpidsha1');
    rpx.device.dpid_type = getSelectValueForId('device-dpid_type');
    rpx.kw = getTextAreaValueForId('keywords');
    rpx.i = getTextAreaValueForId('inventory',true);
    rpx.i_raw = getTextAreaValueForId('inventory');
    rpx.v = getTextAreaValueForId('visitor',true);
    rpx.v_raw = getTextAreaValueForId('visitor');
    rpx.geo.latitude = getTextValueForId('geo.latitude');
    rpx.geo.longitude = getTextValueForId('geo.longitude');
    rpx.geo.type = getSelectValueForId('geo.type');
    rpx.geo.consent = getRadioValueForName('geo.consent');
    rpx.accept.apis = getRadioValueForName('accept.apis');
}



function createTagObjectFromTags(list) {
    var sitename, zonename, size, placement, accountId, siteId, zoneId;
    var sitePatt = /(Site\s*:.+)Zone/i;
    var zonePatt = /(Zone\s*:.+)Size/i;
    var sizePatt = /(Size\s*:.+) /i;
    var placementPatt = /(Placement\s*:.+) /i;

    var newTags = [];

    for (i = 0; i < list.length; i++) {
        var l = list[i];

        var s = sitePatt.exec(l);
        var s1 = s[1].split(/site:/i);
        sitename = s1[1].trim();

        var z = zonePatt.exec(l);
        var z1 = z[1].split(/zone:/i);
        zonename = z1[1].trim();

        var sz = sizePatt.exec(l);
        var sz1 = sz[1].split(/size:/i);
        size = sz1[1].trim();

        var p = placementPatt.exec(l);
        var p1 = (p) ? p[1].split(/placement:/i) : null;
        placement = (p1) ? p1[1].trim() : null;

        var aID = /rp_account.+/.exec(l);
        var aID1 = aID[0].split('=');
        accountId = /\d+/.exec(aID1[1])[0];

        var sID = /rp_site.+/.exec(l);
        var sID1 = sID[0].split('=');
        siteId = /\d+/.exec(sID1[1])[0];

        var zID = /rp_zonesize.+/.exec(l);
        var zID1 = zID[0].split('=');
        zoneId = /[\d\-]+/.exec(zID1[1])[0];

        var tag = new Tag(sitename, zonename, size, accountId, siteId, zoneId, placement);
        newTags.push(tag);
    }
    masterTagArray = (masterTagArray.length == 0) ?  newTags : masterTagArray.concat(newTags);
    collectZoneNames(masterTagArray);
    setTagRows(masterTagArray, zoneNames);
}




//TODO: Add JSDoc description - collectZoneNames
function collectZoneNames(tags) {
    var zones = {};
    var tagsLength = tags.length;

    for (var i = 1; i < tagsLength; i++) {
        zones[tags[i].zone] = tags[i].zone;
    }

    zoneNames = Object.keys(zones);
    zoneNames.sort();
}


//TODO:  Add JSDoc description - setUniqueTags
function setUniqueTags(tags) {
    var tagArray = [];
    var tag2 = null;

    for (var i = 0; i < tags.length; i++) {
        var tag1 = tags[i];
        if (!tag2) {
            tag2 = tag1;
            tagArray.push(tag2);
        }

        if (tag1.site == tag2.site) {
            if (tag1.zone != tag2.zone) {
                tag2 = tag1;
                tagArray.push(tag2);
            }
        } else {
            tag2 = tag1;
            tagArray.push(tag2);
        }
    }
    return tagArray;
}

function setTagRows(tags, zoneNames) {
    var tbody = document.getElementsByTagName('tbody').item(0);
    var uniqueTags = setUniqueTags(tags);

    //Reset table entries
    if (tbody.hasChildNodes()) {
        tbody.innerHTML = "";
    }

    for (var k = 0; k < uniqueTags.length; k++) {
        var tag = uniqueTags[k];
        var tr = document.createElement('tr');
        var editButton = document.createElement('button');
        var checkbox = document.createElement('input');
        var td_checkbox = document.createElement('td');
        var td_site = document.createElement('td');
        var td_zone = document.createElement('td');
        var td_status = document.createElement('td');
        var td_editButton = document.createElement('td');

        tbody.appendChild(tr);

        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('data-site', tag.site);
        checkbox.setAttribute('data-zone', tag.zone);

        tr.appendChild(td_checkbox);
        tr.appendChild(td_site);
        tr.appendChild(td_zone);
        tr.appendChild(td_status);
        tr.appendChild(td_editButton);

        td_checkbox.appendChild(checkbox);

        td_editButton.appendChild(editButton);
        td_site.innerHTML = "<label>" + tag.site + "</label>";
        td_zone.innerHTML = "<label>" + tag.zone + "</label>";

        tr.id = 'tr'+k;
        td_site.className = 'table-site';
        td_zone.className = 'table-zone';
        td_status.className = 'table-status';
        td_editButton.className = 'table-editButton';

        editButton.name = 'edit-tag-button';
        editButton.textContent = 'Edit Tag';
        editButton.setAttribute('data-site', tag.site);
        editButton.setAttribute('data-zone', tag.zone);

        if (tag.isNew) {
            td_status.innerHTML = "<label data-site='" + tag.site + "' data-zone='" + tag.zone + "' class='new'>NEW</label>";
        } else if (!tag.isComplete) {
            td_status.innerHTML = "<label data-site='" + tag.site + "' data-zone='" + tag.zone + "' class='incomplete'>INCOMPLETE</label>";
        } else {
            td_status.innerHTML = "<label data-site='" + tag.site + "' data-zone='" + tag.zone + "' class='complete'>COMPLETE</label>";
        }
    }

    setEditButtonListener();
    var tagCheckBoxes = dqa('input[type="checkbox"]');
    setTagCheckboxListener(tagCheckBoxes);

}


function selectTag() {
    var site = this.dataset.site;
    var zone = this.dataset.zone;

    masterTagArray.map(function (tag) {
        if (tag.site == site && tag.zone == zone) {
            tag.isChecked = !tag.isChecked;

            var selectAllCheckbox = dqa('input[type="checkbox"]').item(0);
            if (selectAllCheckbox.checked) {
                selectAllCheckbox.checked = false;
            }
        }
    });

}

function setTagCheckboxListener(checkboxes) {
    for (i = 1; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('click', selectTag);
    }

    checkboxes[0].addEventListener('click', selectAll);
}

function selectAll() {
    var selectAllButtonEnabled = this.checked;
    var checkBoxArray = dqa('input[type="checkbox"]');

    for (var i = 1; i < checkBoxArray.length; i++) {
        var statusLabel = checkBoxArray[i].parentElement.parentElement.children[3].children[0];

        if (selectAllButtonEnabled) {
            if (statusLabel.className.toLowerCase() == 'complete') {
                checkBoxArray[i].checked = true;
                masterTagArray.map(function (tag) {
                    if (tag.isComplete) {
                        tag.isChecked = true;
                    }
                });
            } else {
                checkBoxArray[i].checked = false;
                masterTagArray.map(function (tag) {
                    if (!tag.isComplete) {
                        tag.isChecked = false;
                    }
                });
            }
        } else {
            checkBoxArray[i].checked = false;

            masterTagArray.map(function (tag) {
                if (tag.site == checkBoxArray[i].dataset.site && tag.zone == checkBoxArray[i].dataset.zone) {
                    tag.isChecked = false;
                }
            });
        }
    }
}



var inputVals = dqa('input[type="text"]');
for (i = 0; i < inputVals.length; i++) {
    inputVals[i].autocomplete = 'on';
}



var exportButton = dq('#export-tag');
exportButton.addEventListener('click', createBlob);
setEditButtonListener();
input.addEventListener('change',handleFileSelect);



function tagsBySiteZone(site,zone) {
    var tagSet = [];
    for (var i = 0; i < masterTagArray.length; i++) {
        var tag = masterTagArray[i];
        if (tag.site == site && tag.zone == zone) {
            tagSet.push(tag);
        }
    }
    return tagSet;
}

function rpDemo() {
    if (editModal.style.visibility == 'visible') {
        setTextForID('app.name', 'Rubi Blast: Xtreme');
        setTextForID('app.domain', 'rpstudios.rubiconproject.com');
        setTextForID('app.bundle', 'com.rubiconproject.rubiblastxtreme');
        setTextForID('app.storeurl', 'http://store.app/#demo?id=00110100001110010110001001100011');
        setTextForID('app.appstoreid', '00110100001110010110001001100011');
    }
}