
let exchangeFrom = document.querySelector(".exchange-from-value");
let exchangeTo = document.querySelector(".exchange-to-value");
let exchangeFromList = document.querySelector(".exchange-from-list");
let exchangeToList = document.querySelector(".exchange-to-list");
let change = document.querySelector(".page .exchange-box .change ");
let keysList = document.querySelectorAll(".keyboard-box li");
let timeInfo = document.querySelector(".page .exchange-box nav .time-info");
// const clickAudio = document.querySelector("audio#click");
const writeAudio = document.querySelector("audio#write");
let currencyList;
let inputFromStart;

window.onload=()=>{
    start();
}

const data = (apiLink)=>{
    return fetch(apiLink)
    .then((data)=>data.json())
}

const firstSet = (list)=>{
    exchangeFrom.value=(list.rates.USD).substring(0,6);
    exchangeTo.value=(list.rates.TND).substring(0,6);
}

const fillOptions = (list)=>{
    let sortedList = Object.keys(list.rates).sort();
    for(i =0;i<sortedList.length;i++){
            let option=document.createElement("option");
            option.append(document.createTextNode(sortedList[i]));
            option.value=sortedList[i];
            let copyOption = option.cloneNode(true);
            if(sortedList[i]==="USD"){
                option.selected=true;
            }
            if(sortedList[i]==="TND"){
                copyOption.selected=true;
            }
            exchangeFromList.append(option);
            exchangeToList.append(copyOption);
    }
}

const start = async ()=>{
    currencyList = await data("https://api.currencyfreaks.com/v2.0/rates/latest?apikey=adb3b14d8c7a405a8b1f40a16307d789");
    firstSet(currencyList);
    fillOptions(currencyList);
    inputFromStart=exchangeFrom.value.indexOf(".");
}

const exchangeFromF = async ()=>{
    writeAudio.play();
    let currencyFrom =currencyList.rates[exchangeFromList.value];
    let currencyTo =currencyList.rates[exchangeToList.value];
    exchangeFrom.value=Array.from(exchangeFrom.value).every((e)=>/(\d|\.)/.test(e))?
    (exchangeFrom.value).toString().substring(0,6):0;
    exchangeTo.value=  +((+exchangeFrom.value / +currencyFrom) * +currencyTo).toFixed(3).toString().substring(0,6);
}
const exchangeToF = async ()=>{
    writeAudio.play();
    let currencyTo =currencyList.rates[exchangeToList.value];
    let currencyFrom =currencyList.rates[exchangeFromList.value];
    exchangeTo.value=Array.from(exchangeTo.value).every((e)=>/(\d|\.)/.test(e))?
    (exchangeTo.value).toString().substring(0,6):0;
    exchangeFrom.value=  +((+exchangeTo.value / +currencyTo) * +currencyFrom).toFixed(3).toString().substring(0,6);
}

exchangeFrom.addEventListener("input",exchangeFromF);
exchangeFromList.addEventListener("input",exchangeFromF);
exchangeFrom.addEventListener("click",(e)=>{
    inputFromStart =e.target.selectionStart;
});
exchangeFrom.addEventListener("input",(e)=>{
    inputFromStart =e.target.selectionStart;
});

exchangeTo.addEventListener("input",exchangeToF);
exchangeToList.addEventListener("input",exchangeToF);

timeInfo.addEventListener("click",()=>{
    writeAudio.play();
    timeInfo.lastElementChild.innerHTML="";
    let h3= document.createElement("h3");
    h3.append(document.createTextNode("last update time"));
    let h4= document.createElement("h4");
    h4.append(currencyList.date);
    timeInfo.lastElementChild.append(h3);
    timeInfo.lastElementChild.append(h4);
    timeInfo.lastElementChild.style.display="block";
    setTimeout(()=>{
        timeInfo.lastElementChild.style.display="none";
    },4000);
});

change.addEventListener("click",()=>{
    writeAudio.play();
    [exchangeFrom.value,exchangeTo.value]=[exchangeTo.value,exchangeFrom.value];
    [exchangeFromList.selectedIndex,exchangeToList.selectedIndex]=[exchangeToList.selectedIndex,exchangeFromList.selectedIndex];
});

keysList.forEach((e)=>{
    e.onclick=()=>{
        // clickAudio.play();
        if(/(\d|\.)/.test(e.innerHTML)){
            exchangeFrom.value=
            exchangeFrom.value.substring(0,inputFromStart)
            +e.textContent+
            exchangeFrom.value.substring(inputFromStart,exchangeFrom.value.length);
            exchangeFrom.value=+exchangeFrom.value.substring(0,6);
            if(inputFromStart<6){
                inputFromStart++;
            }
        }else{
            exchangeFrom.value=+(exchangeFrom.value.substring(0,inputFromStart-1)
            + exchangeFrom.value.substring(inputFromStart, exchangeFrom.value.length));
            if(inputFromStart>1){
                inputFromStart--;
            }else{
                inputFromStart=1;
            }
        }
        exchangeFromF();
    }
})