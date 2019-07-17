initilized = {'allweb': false, 'wiki': false}

function initilize(target) {
    var gcse = document.getElementsByTagName('body')[0].appendChild(document.createElement("GCSE:SEARCHRESULTS-ONLY"));
    gcse.setAttribute("gname", target);
    console.log(gcse);
    console.log("running script object");
    if (target == 'allweb') {
        var cx = '017156356425142035309:pwvs3bfqtwu'; // default
    } else if (target == 'wiki') {
        var cx = '017156356425142035309:vkkn2ilc6o8'; // wiki
    } else if (target == 'youtube') {
        var cx = '017156356425142035309:oganp1ndff4'; // youtube
    }
    else {
        console.log("no target was found!");
    }
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
};

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

function onSelectedText (target, event) {
    if (!initilized[target]) {
        initilize(target);
    }
    waitUntil(() => {
        return window.google && window.google.search.cse.element.getElement(target);
    }, 100).then((elem) => {
        if (!initilized[target]) {
            document.getElementById("___gcse_0").id = "___gcse_0_" + target;
            initilized[target] = true;
        }           
        console.log('executing query');
        console.log(event);
        console.log(window.google.search.cse.element.getAllElements());
        elem.execute(event.detail);

    });
}

document.addEventListener('search allweb', (event) => {onSelectedText('allweb', event);});
document.addEventListener('search wiki', (event) => {onSelectedText('wiki', event);});
document.addEventListener('search youtube', (event) => {onSelectedText('youtube', event);});
