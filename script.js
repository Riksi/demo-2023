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

    let learnTrans = ["", ""]
    content['text'].forEach(
        ()=>{learnTrans.push("")}
    )
    

    let initTextDiv = textDivTmp.cloneNode(true)
    initTextDiv.querySelector('.text-content').innerHTML = content["text"][0];

    

    container.appendChild(titleDiv)
    container.appendChild(panel)
    container.appendChild(dateDiv)
    container.appendChild(initTextDiv)

    
    

    for(block of content["text"].slice(1)){
        let textDiv = textDivTmp.cloneNode(true);
        textDiv.querySelector('.text-content').innerHTML = block;
        container.appendChild(textDiv);
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


    let divs = Array.from(document.querySelectorAll('.text-div'))
    let btn = document.getElementById('compare-btn');
    let transInput = document.getElementById('trans-input'); 
    let diff = document.getElementById('diff');
    let activeIdx = 0;

    let textSpans = Array.from(document.querySelectorAll('.text-content'));

    function getTrans(idx, gloss=true){
        if(idx == 0) return content["titletrans"] + (gloss ? transElem : "");
        if(idx == 1) return content["datetrans"]
        return content["trans"][idx - 2]
    }

    divs.forEach(
        (div, idx) => {
            let contentDiv = div.querySelector('.text-content');
            let glossDiv = div.querySelector('.right')
            contentDiv.onmouseover = ()=>{
                glossDiv.innerHTML = getTrans(idx);
            
            }
            contentDiv.onmouseout = ()=>{glossDiv.innerHTML = ""}
        }
    )
    
    textSpans.forEach(
        (textSpan, idx) => {
            textSpan.addEventListener('click',
                ()=>{
                    if (activeIdx == idx){
                        return;
                    }
                    textSpans[activeIdx].classList.remove('text-content-active');
                    textSpan.classList.add('text-content-active');
                    textSpans[activeIdx].classList.add('text-content-inactive');
                    textSpan.classList.remove('text-content-inactive');
                    
                    activeIdx = idx;
                    let div = divs[idx];
                    if (idx < (textSpans.length - 1)){
                        div.parentNode.insertBefore(panel, divs[idx + 1])
                    }
                    else{
                        div.parentNode.appendChild(panel)
                    }
                    panel.style.display='block';

                    
                    transInput.value = learnTrans[activeIdx];
                    diff.innerHTML = "";
                }
            
            )
        }
    )
    
    transInput.onkeyup = ()=>{
        learnTrans[activeIdx] = transInput.value
    }
    
    btn.onclick = ()=>{
        addDiff(
            transInput.value.trim().toLowerCase(),
            getTrans(activeIdx, gloss=false).trim().toLowerCase(),
            diff
        );
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