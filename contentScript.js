targets = ['allweb', 'wiki', 'youtube'];

function waitUntil(condition, usec) {
    return new Promise((resolve) => {
        intervalId = setInterval(() => {
            console.log('resolving condition');
            res = condition();
            if (res) {
                clearInterval(intervalId);
                resolve(res);
            }
        }, usec);
    });
}

function sendEvent(searchTarget, selectedText) {
  const evt = document.createEvent('CustomEvent');
  evt.initCustomEvent('search ' + searchTarget, true, true, selectedText);
  document.dispatchEvent(evt);
}

function calculateTarget(e) {
    if (e.altKey) {
        return keysToTargets['alt'];
    } else if (e.metaKey) {
        return keysToTargets['ctrl'];
    } else {
        return keysToTargets['default'];
    }
}

function gText(e) {
    for (var tar in resultsShow) {
        console.log(tar);
        if (resultsShow[tar]) {
            var myElementToCheckIfClicksAreInsideOf = document.querySelector('#___gcse_0_' + tar);
            if (myElementToCheckIfClicksAreInsideOf.contains(e.tar)) {
                console.log('clicked inside');
                return;
            } else {
                console.log('clicked outside');
                document.getElementById("___gcse_0_" + tar).style.display = "none";
                resultsShow[tar] = false;
            }
        }
    };
    target = calculateTarget(e);
    if (target == "") {
        return;
    }
    t = (document.all) ? document.selection.createRange().text : document.getSelection();
    console.log(t);
    selectedText = t.toString();
    console.log(selectedText);
    if (selectedText === "") {
        console.log(selectedText);
        return;
    }    

    var x = e.pageX;
    var y = e.pageY + 12;
    var screenWidth = document.body.clientWidth;
    if(x/screenWidth > 2/3) {
        x -= (screenWidth*0.2 + 60);
    }

    console.log("x ", x);
    console.log("y ", y);
    console.log(e);
    resultsShow[target] = true;
    if (firstSearch) {
        var s = document.createElement('script');
        s.id = "extensionScript";
        s.src = chrome.extension.getURL('script.js');
        (document.head || document.documentElement).appendChild(s);    
        
        s.onload = function() {
            s.remove();
            sendEvent(target, selectedText);        
            firstSearch = false;
        };
    } else {
        sendEvent(target, selectedText);
    }    

    waitUntil(() => {
        a = document.getElementById("___gcse_0_" + target);
        return a.getElementsByClassName('gsc-results-wrapper-overlay gsc-results-wrapper-visible')[0];
    }, 100).then((results) => {
        console.log("results found");
        if (!initilized[target]) {
            console.log(document.getElementsByClassName('gsc-above-wrapper-area'));
            results.removeChild(document.getElementsByClassName('gsc-above-wrapper-area')[0]);
            console.log(document.getElementsByClassName('gsc-results-close-btn gsc-results-close-btn-visible'));
            results.removeChild(document.getElementsByClassName('gsc-results-close-btn gsc-results-close-btn-visible')[0]);
            backParent = document.getElementById("___gcse_0_" + target).getElementsByClassName('gsc-control-wrapper-cse')[0];
            backParent.removeChild(document.getElementsByClassName('gsc-modal-background-image gsc-modal-background-image-visible')[0]);
            initilized[target] = true;
        }   
        results.style.left = x + "px";
        results.style.top = y + "px";
        results.style.width = 20 + "%";
        results.style.height = 40 + "%";
        waitUntil(() => {
            return document.getElementsByClassName('gsc-loading-fade').length === 0;
        }, 100).then(() => {        
            document.getElementById("___gcse_0_" + target).style.display = "block";
            results.scrollTop = 0;
            });
    });
}

initilized = {};
resultsShow = {};
targets.forEach((target) => {
    initilized[target] = false;
    resultsShow[target] = false;
});


firstSearch = true;

keysToTargets = {}
var gettingItem = browser.storage.sync.get('keys');
gettingItem.then((res) => {
    keysToTargets = res.keys;
});

document.addEventListener("mouseup", gText);
