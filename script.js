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
}

window.onload = function(){
    let panel = document.getElementById('panel');
    let textDivTmp = document.querySelector('.text-div');
    let container = document.getElementById('container');
    let titleDiv = textDivTmp
    titleDiv.querySelector('.text-content').innerHTML = content["title"];
    
    let learnTrans = ["", ""]
    content['text'].forEach(
        ()=>{learnTrans.push("")}
    )

    let dateDiv = textDivTmp.cloneNode(true)
    dateDiv.querySelector('.text-content').innerHTML = content["date"];

    

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
    authorElem.className = "author"
    authorElem.innerHTML = "(" + content["author"] + ")"
    titleDiv.querySelector('.left').appendChild(authorElem)

    dateDiv.classList.add('date')



    let divs = Array.from(document.querySelectorAll('.text-div'))
    let divButtons = Array.from(document.querySelectorAll('.trans-btn'))
    let btn = document.getElementById('compare-btn');
    let transInput = document.getElementById('trans-input'); 
    let diff = document.getElementById('diff');
    let activeIdx = 0

    function getTrans(idx){
        if(idx == 0) return content["titletrans"]
        if(idx == 1) return content["datetrans"]
        return content["trans"][idx - 2]
    }

    function getClass(idx){
        if(idx == 0) return "title"
        if(idx == 1) return "date"
        return null
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
    
    divButtons.forEach(
        (divBtn, idx) => {
            divBtn.addEventListener('click',
                ()=>{
                    activeIdx = idx;
                    let div = divs[idx];
                    if (idx < (divButtons.length - 1)){
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
            getTrans(activeIdx).trim().toLowerCase(),
            diff
        );
    }
}