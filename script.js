let panel, textDivTmp;

function addDiff(trans, truetrans, div){
    div.innerHTML = "";
    const diff = Diff.diffChars(trans, truetrans);
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
    span.appendChild(document
        .createTextNode(part.value));
    div.appendChild(span);
    }
    
    );

    if(trans == truetrans){
        let span = document.createElement('span');
        // Smile emoji
        span.innerHTML = " &#128512;";
        div.appendChild(span);
    }
}

function generateEssay(content){

    let container = document.getElementById('container');
    container.innerHTML = "";


    let titleDiv = textDivTmp.cloneNode(true);
    titleDiv.querySelector('.text-content').innerHTML = content["title"];
    

    let dateDiv = textDivTmp.cloneNode(true)
    dateDiv.querySelector('.text-content').innerHTML = content["date"];

    let initTextDiv = textDivTmp.cloneNode(true)
    initTextDiv.querySelector('.text-content').innerHTML = content["text"][0];

    let bar = document.querySelector('#progress-bar-inner');
    let progressText = document.querySelector('#progress-bar-text');
    bar.style.width = "0%";
    if(bar.classList.contains('progress-bar-inner-finished')){
        bar.classList.remove('progress-bar-inner-finished')
    }
    
    

    container.appendChild(titleDiv)
    container.appendChild(panel)
    // container.appendChild(dateDiv)
    // container.appendChild(initTextDiv)

    
    
    let textDivs = []

    for(block of content["text"].slice(1)){
        let textDiv = textDivTmp.cloneNode(true);
        textDiv.querySelector('.text-content').innerHTML = block;
        textDivs.push(textDiv);
    }
    

    titleDiv.classList.add('title')
    let authorElem = document.createElement('span')
    let transElem = document.createElement('span')
    authorElem.className = "author"
    authorElem.innerHTML = "(" + content["author"]+ ")"
    titleDiv.querySelector('.left').appendChild(authorElem)
    transElem = ("<span class=author style='font-weight:normal'>(Translated by " + content['translator'] 
                + ")</span>")

    dateDiv.classList.add('date')

    titleDiv.querySelector('.text-content').classList.add('text-content-active');
    activateGloss(titleDiv)

    let divs = [titleDiv, dateDiv, initTextDiv, ...textDivs];
    let btn = document.getElementById('compare-btn');
    let transInput = document.getElementById('trans-input'); 
    let diff = document.getElementById('diff');
    let activeIdx = 0;
    var learnTrans = {}

    progressText.innerHTML = "0%"

    function getTrans(idx, gloss=true){
        if(idx == 0) return content["titletrans"] + (gloss ? transElem : "");
        if(idx == 1) return content["datetrans"]
        return content["trans"][idx - 2]
    }

    function activateGloss(div){
        let contentDiv = div.querySelector('.text-content');
        let glossDiv = div.querySelector('.right')
        contentDiv.onmouseover = ()=>{
            glossDiv.innerHTML = getTrans(activeIdx);
        }
        contentDiv.onmouseout = ()=>{glossDiv.innerHTML = ""}
    }

    function deactivateGloss(div){
        let contentDiv = div.querySelector('.text-content');
        contentDiv.onmouseover = ()=>{}
        contentDiv.onmouseout = ()=>{}
    }

    
    function showNext(){
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
            bar.classList.add('progress-bar-inner-finished')
        }
        if(activeIdx < (divs.length - 1)){
            activateGloss(divs[activeIdx + 1])
            container.insertBefore(divs[activeIdx + 1], panel);
            divs[activeIdx + 1].querySelector('.text-content').classList.add('text-content-active');
        }
        else{
            panel.style.display='none';
        }
    }
    
    transInput.onkeyup = ()=>{
        learnTrans[activeIdx] = transInput.value
    }
    
    btn.onclick = ()=>{
        let x= transInput.value.trim().toLowerCase();
        let y = getTrans(activeIdx, gloss=false).trim().toLowerCase();
        addDiff(x, y, diff);
        if (x == y){
            showNext();
            activeIdx += 1;
        }
    }
}

window.onload = function(){
    // Create select element with keys as item['title'] for each item in "data"
    panel = document.getElementById('panel');
    textDivTmp = document.querySelector('.text-div');
    let select = document.getElementById('select-essay');
    for (let key in data){
        let option = document.createElement('option');
        option.value = key;
        option.innerHTML = data[key]['title'];
        select.appendChild(option);
    }
    select.onchange = ()=>{
        generateEssay(data[select.value]);
    }
    generateEssay(data[select.value]);
    
}