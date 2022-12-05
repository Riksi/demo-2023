let panel, textDivTmp, resetBtn, wellDone, statusSpan;
let testBtn;
let initHeight;
const TEST = true;


const LANG_MAP = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
}

function skipAll(){
    console.log("Skipping to the end");
    let skip = document.querySelector("#skip-btn");
    let idx = 0;
    while(idx < 1000){
        skip.click();
        idx++
        if(skip.style.display == 'none') break
    }
}

function isDiff(x, y){
    x = x.toLowerCase();
    y = y.toLowerCase();
    let diff = Diff.diffWords(x, y);
    for (let i = 0; i < diff.length; i++){
        if (diff[i].added || diff[i].removed){
            return true;
        }
    }
    return false;
}

function addDiff(trans, truetrans, div){
    div.innerHTML = "";
    const diff = Diff.diffWords(trans, truetrans);
    diff.forEach((part) => {
    // green for additions, red for deletions
    // grey for common parts
    const color = part.added ? 'green' :
        part.removed ? 'red' : 'gray';
    let span = document.createElement('span');
    if (color != "gray"){
        span.style.fontWeight = "bold";
    }
    span.style.color = color;
    if (part.removed){
        span.style.textDecoration = "line-through";
    }
    span.appendChild(document
        .createTextNode(part.value));
    div.appendChild(span);
    }
    
    );

    if(!isDiff(trans, truetrans)){
        let span = document.createElement('span');
        // Smile emoji
        span.innerHTML = " &#128512;";
        div.appendChild(span);
    }
}

function generateEssay(content){
    wellDone.style.display = "none";
    document.querySelector('body').style.height = initHeight + "px";

    let tar = document.getElementById('select-lang').value;

    let container = document.getElementById('container');
    container.innerHTML = "";


    let titleDiv = textDivTmp.cloneNode(true);
    titleDiv.querySelector('.text-content').innerHTML = content['en']["title"];
    

    let dateDiv = textDivTmp.cloneNode(true)
    dateDiv.querySelector('.text-content').innerHTML = content['en']["date"];

    let initTextDiv = textDivTmp.cloneNode(true)
    initTextDiv.querySelector('.text-content').innerHTML = content['en'][tar][0];

    let bar = document.querySelector('#progress-bar-inner');
    let progressText = document.querySelector('#progress-bar-text');
    bar.style.width = "0%";
    if(bar.classList.contains('progress-bar-inner-finished')){
        bar.classList.remove('progress-bar-inner-finished')
    }
    bar.classList.add('progress-bar-inner-unfinished')
    
    

    container.appendChild(titleDiv)
    container.appendChild(panel)
    // container.appendChild(dateDiv)
    // container.appendChild(initTextDiv)

    
    
    let textDivs = []

    for(block of content["en"][tar].slice(1)){
        let textDiv = textDivTmp.cloneNode(true);
        textDiv.querySelector('.text-content').innerHTML = block;
        textDivs.push(textDiv);
    }
    

    titleDiv.classList.add('title')
    let authorElem = document.createElement('p')
    authorElem.className = "author"
    authorElem.innerHTML = (
        "(" + content['en']["author"]+ ": "
        + "<a href='" + content['en']['url'] + "'>Source</a>)")
    let titleDivLeft = titleDiv.querySelector('.left')
    titleDivLeft.appendChild(authorElem)

    transElem = ("<p class=author>(Translated by " + content[tar]['author'] 
                + ": " + "<a href=" + content[tar]['url'] + ">Source</a>)</p>"
                )

    dateDiv.classList.add('date')

    titleDiv.querySelector('.text-content').classList.add('text-content-active');
    activateGloss(titleDiv)

    let divs = [titleDiv, dateDiv, initTextDiv, ...textDivs];
    let btn = document.getElementById('compare-btn');
    let skipBtn = document.getElementById('skip-btn');
    let transInput = document.getElementById('trans-input'); 
    let diff = document.getElementById('diff');
    let translationShown = false;
    let spaceBarHeld = false;
    let activeIdx = 0;
    var learnTrans = {}
    
    transInput.value = "";
    transInput.focus();
    diff.innerHTML = "";
    statusSpan.innerHTML = "";
    btn.disabled = true;
    progressText.innerHTML = "0%"

    function getTrans(idx, gloss=true){
        if(idx == 0) return content[tar]['title'] + (gloss ? transElem : "");
        if(idx == 1) return content[tar]['date']
        return content[tar]['en'][idx - 2]
    }

    function activateGloss(div){
        let contentDiv = div.querySelector('.text-content');
        let glossDiv = div.querySelector('.right')
        contentDiv.onmouseover = ()=>{
            glossDiv.innerHTML = getTrans(activeIdx);
            translationShown = true;
        }
        contentDiv.onmouseout = ()=>{
            glossDiv.innerHTML = ""
            translationShown = false;
        }
    }

    function deactivateGloss(div){
        let contentDiv = div.querySelector('.text-content');
        contentDiv.onmouseover = ()=>{}
        contentDiv.onmouseout = ()=>{}
    }

    
    function showNext(){
        statusSpan.innerHTML = "";
        btn.disabled = true;
        translationShown = false;
        spaceBarHeld = false;
        divs[activeIdx].querySelector('.right').innerHTML = getTrans(activeIdx);
        transInput.value = "";
        diff.innerHTML = "";
        deactivateGloss(divs[activeIdx])
        divs[activeIdx].querySelector('.text-content').classList.remove('text-content-active');
    
        bar.style.width = (activeIdx + 1) / divs.length * 100 + "%";
        let perc = (activeIdx + 1) / divs.length * 100;
        perc = Math.round(perc * 100) / 100;
        progressText.innerHTML = perc + "%"

        if(activeIdx == (divs.length - 1)){
            bar.classList.remove('progress-bar-inner-unfinished')
            bar.classList.add('progress-bar-inner-finished')
            skipBtn.style.display = "none";
            panel.style.display='none';
            if(TEST){
                // get rid of event listeners for testBtn
                testBtn.removeEventListener('click', skipAll);
                testBtn.enabled = false;
            }
            wellDone.style.display = "block";
        }
        else {
            activateGloss(divs[activeIdx + 1])
            container.insertBefore(divs[activeIdx + 1], panel);
            let newHeight = (
                document.querySelector('body').offsetHeight 
                + 1.8 * divs[activeIdx + 1].offsetHeight);
            document.querySelector('body').style.height = (newHeight + "px");
            divs[activeIdx + 1].querySelector('.text-content').classList.add('text-content-active');
            // divs[activeIdx + 1].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            activeIdx += 1;
            //focus on transInput
            transInput.focus();
        
        }   
        
    }

    // If you press and hold space bar when in transInput, show the translation
    transInput.onkeydown = (e)=>{
        let glossDiv = divs[activeIdx].querySelector('.right');
        // if(e.keyCode == 32){
        //     e.preventDefault();
        // }
        // if((e.keyCode == 32) && e.repeat){
        //     if(!translationShown){
        //         glossDiv.innerHTML = getTrans(activeIdx);
        //         translationShown = true;
        //     }
        //     spaceBarHeld = true;
            
        // }
        // right arrow
        if((e.keyCode == 39) && (transInput.selectionStart == transInput.value.length)){
            e.preventDefault();
            if (e.repeat && (!translationShown)){
                glossDiv.innerHTML = getTrans(activeIdx);
                translationShown = true;
            }
        }
    }


    transInput.onkeyup = (e)=>{
        // Don't show space until space is released
        btn.disabled = transInput.value.trim().length == 0;
        // if(e.keyCode == 32){
        //     if(!spaceBarHeld){
        //         // find cursor position and insert space
        //         let pos = transInput.selectionStart;
        //         let val = transInput.value;
        //         transInput.value = val.slice(0, pos) + " " + val.slice(pos);
        //         // place cursor after space
        //         transInput.selectionStart = pos + 1;
        //         transInput.selectionEnd = pos + 1;
        //     } else {
        //         spaceBarHeld = false;
        //     }
        // }
        let glossDiv = divs[activeIdx].querySelector('.right');
        // firstSpacePressTime = null;
        if(translationShown){
            glossDiv.innerHTML = "";
            translationShown = false;
        }

        learnTrans[activeIdx] = transInput.value;
        // if match statusSpan shows smile emoji otherwise :( emoji
        if(transInput.value.trim().length > 0){
            let transSoFar = transInput.value.trim();
            let transTrue = getTrans(activeIdx, false)
            // completed emoji
            if(!isDiff(transSoFar, transTrue)){
                statusSpan.innerHTML = "&#128175";
            }
            else{
                let transTrueToCompare = transTrue.slice(0, transSoFar.length);
                if(!isDiff(transSoFar, transTrueToCompare)){
                    // code for :)
                    statusSpan.innerHTML = "&#x1F60A";
                } else {
                    // code for :(
                    statusSpan.innerHTML = "&#x1F61E";
                }
            }   
        } else {
            statusSpan.innerHTML = "";
        }
    }


    skipBtn.onclick = ()=>{
        showNext();
    }
    
    btn.onclick = ()=>{
        let x= transInput.value.trim().toLowerCase();
        let y = getTrans(activeIdx, gloss=false).trim().toLowerCase();
        addDiff(x, y, diff);
        if (isDiff(x, y)){
        } else {
            showNext();
        }
    }

    if(TEST){
        testBtn.enabled = true;
        testBtn.addEventListener('click', skipAll);
    }

    panel.style.display='block';
    skipBtn.style.display = "block";
}

window.onload = function(){
    // Create select element with keys as item['title'] for each item in "data"
    if(TEST){
        testBtn = document.createElement('input')
        testBtn.type = "button"
        testBtn.value = "Show All"
        document.querySelector('#select-container').appendChild(testBtn)
    }
    panel = document.getElementById('panel');
    textDivTmp = document.querySelector('.text-div');
    resetBtn = document.getElementById('reset-btn');
    wellDone = document.getElementById('well-done');
    statusSpan = document.getElementById('status');
    initHeight = document.querySelector('body').offsetHeight;
    let select = document.getElementById('select-essay');
    let selectLang = document.getElementById('select-lang');
    for (let key in data){
        let option = document.createElement('option');
        option.value = key;
        option.innerHTML = data[key]['title'];
        select.appendChild(option);
    }
    // sort LANG_MAP keys based on LANG_MAP values
    let sortedLangs = Object.keys(LANG_MAP);
    sortedLangs.sort((a, b)=>{
        return (
            LANG_MAP[a] > LANG_MAP[b] ? 1 : -1
        )
    })

    sortedLangs.forEach((lang)=>{
        if(lang == "en"){
            return;
        }
        let option = document.createElement('option');
        option.value = lang;
        option.innerHTML = LANG_MAP[lang];
        selectLang.appendChild(option);
    })


    function setupSelectEssay(){
        select.innerHTML = "";
        let lang = selectLang.value;
        let sortedTitles = Object.keys(data);
        sortedTitles.sort((a, b)=>{
            return sortedTitles[a] > sortedTitles[b] ? 1 : -1;
        })
        sortedTitles.forEach((title)=>{
            if(lang in data[title]){
                let option_essay = document.createElement('option');
                option_essay.value = title;
                option_essay.innerHTML = data[title]['en']['title'];
                select.appendChild(option_essay);
            }
        })

        select.onchange = ()=>{
            generateEssay(data[select.value]);
        }
        
        generateEssay(data[select.value]);
    }

    selectLang.onchange = setupSelectEssay;

    resetBtn.onclick = ()=>{
        generateEssay(data[select.value]);
    }

    setupSelectEssay();
    
}