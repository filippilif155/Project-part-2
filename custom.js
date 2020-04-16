const forma = document.getElementById("form");
const secndCol = document.getElementById("list-products");
const thrdCol = document.getElementById("thrd-col");
const productName = document.getElementById("name");
const productDesc = document.getElementById("desc");
const productImg = document.getElementById("img");
const productPrice = document.getElementById("price");
const maskDiv = document.getElementById("mask");
const total = document.getElementById("total");

var localStorageObj = {"items": []};

let localId = localStorage.getItem("store");

if(localId && localId !== "undefined"){
    fetch(localId, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            localStorageObj = data;
            for(i = 0; i < localStorageObj["items"].length; i++){
                if(localStorageObj["items"][i][4] === 0){
                    drawScndCol(localStorageObj["items"][i][0], localStorageObj["items"][i][1], localStorageObj["items"][i][2], localStorageObj["items"][i][3], 1);
                }
                else{
                    drawScndCol(localStorageObj["items"][i][0], localStorageObj["items"][i][1], localStorageObj["items"][i][2], localStorageObj["items"][i][3], 1);
                    drawThrdCol(localStorageObj["items"][i][0], localStorageObj["items"][i][3], localStorageObj["items"][i][2], localStorageObj["items"][i][4]);
                }
            }
            priceCount();
            
        });
}

forma.addEventListener("submit", () => {
    event.preventDefault();
    var test = 0
    var whatToShow = productName.value;
    for(let i = 0; i < localStorageObj["items"].length; i++){
        if(localStorageObj["items"][i][0] === whatToShow){
            test = 1; 
            break
        }
    }
    if(test === 0){
        drawScndCol(whatToShow, productDesc.value, productImg.value, productPrice.value);
        upload();
    }
    else{
        alert("Item with that name already exist!");
    }
})


function deleteModal(event){
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    maskDiv.style.display = "none";
}
function showModal(event){
    var whatToShow = event.target.parentNode.children[1].innerHTML;
    var modalImgSrc;
    var modalDescValue;
    for(let i = 0; i < localStorageObj["items"].length; i++){
        if(localStorageObj["items"][i][0] === whatToShow){
            modalDescValue = localStorageObj["items"][i][1]; 
            modalImgSrc = localStorageObj["items"][i][2]; 
            break
        }
    }
    let modalWindow = document.createElement("div");
    modalWindow.className = "modal";
    let heading = document.createElement("h3");
    heading.className = "modal-heading";
    heading.innerHTML = whatToShow;
    modalWindow.appendChild(heading);
    let modalImg = document.createElement("img");
    modalImg.className = "modal-img";
    modalImg.src = modalImgSrc;
    modalWindow.appendChild(modalImg);
    let modalDesc = document.createElement("p");
    modalDesc.innerHTML = modalDescValue;
    modalWindow.appendChild(modalDesc);
    let modalBtn = document.createElement("button");
    modalBtn.className = "modal-btn";
    modalBtn.innerHTML = "x";
    modalBtn.addEventListener("click", deleteModal);
    modalWindow.appendChild(modalBtn);
    document.body.appendChild(modalWindow);
    maskDiv.style.display = "block";

}

function drawThrdColEvent(event){

    var whatToShow = event.target.parentNode.children[1].innerHTML;
    var infoPriceValue;
    var infoImgSrc;
    var prdctCount;
    for(var i = 0; i < localStorageObj["items"].length; i++){
        if(localStorageObj["items"][i][0] === whatToShow){ 
            infoImgSrc = localStorageObj["items"][i][2]; 
            infoPriceValue = localStorageObj["items"][i][3];
            prdctCount = localStorageObj["items"][i][4];
            if(prdctCount === 0){
                localStorageObj["items"][i][4] = 1;
            }
            break
        }
    }
    upload();
    drawThrdCol(whatToShow, infoPriceValue, infoImgSrc, prdctCount, 1);
    priceCount();
}

function resolveCount(event){
    var counter = event.target.parentNode.children[1];
    event.target.className = "";
    let itName = event.target.parentNode.parentNode.children[0].children[0].children[0].innerHTML;
    let priceTxtList = event.target.parentNode.parentNode.children[0].children[0].children[1].innerHTML.split(" ");
    if(event.target.innerHTML === "+"){
        if(counter.innerHTML === "10"){
            event.target.className = "limit";
        }
        else{
            counter.innerHTML = parseInt(counter.innerHTML) + 1;
            for(let i = 0; i < localStorageObj["items"].length; i++){
                if(localStorageObj["items"][i][0] === itName){
                    localStorageObj["items"][i][4]++;
                    break
                }
            }
            event.target.parentNode.parentNode.children[0].children[0].children[1].innerHTML = priceTxtList[0] + " &times; " + counter.innerHTML;
            upload();
        }
    }
    else{
        
        if(counter.innerHTML === "1"){
            thrdCol.removeChild(event.target.parentNode.parentNode);
        }
        else{
            counter.innerHTML = parseInt(counter.innerHTML) - 1;       
            event.target.parentNode.parentNode.children[0].children[0].children[1].innerHTML = priceTxtList[0] + " &times; " + counter.innerHTML;
        }
        
        for(let i = 0; i < localStorageObj["items"].length; i++){
            if(localStorageObj["items"][i][0] === itName){
                localStorageObj["items"][i][4]--;
                break
            }
        }
        upload();
    }
    

    priceCount();
}

function priceCount(){
    let list = thrdCol.children;
    var sum = 0;

    for(let i = 0; i < list.length; i++){
        let strLst = list[i].firstChild.firstChild.children[1].innerHTML.split(" ");
        let prc = parseFloat(strLst[0].slice(1, strLst[0].length))
        let times = parseFloat(strLst[2]);
        sum += prc*times;
    }
    total.children[0].innerHTML = "Total: <b>$" + sum.toFixed(2) + "</b>";
}


function drawThrdCol(whatToShow, infoPriceValue, infoImgSrc, prdctCount, fromWhere = 0){
    
    if(prdctCount === 0 || fromWhere === 0){
        
        let shopProduct = document.createElement("div");
        shopProduct.className = "shopping-cart-product";
        let prdctInfo = document.createElement("div");
        prdctInfo.className = "product-info";
        let infoHolder = document.createElement("div");
        let infoHead = document.createElement("h3");
        infoHead.innerHTML = whatToShow;
        infoHolder.appendChild(infoHead);
        let infoPrice = document.createElement("p");
        infoPrice.innerHTML = "$" + infoPriceValue + " &times; " + ++prdctCount;
        infoHolder.appendChild(infoPrice);
        prdctInfo.appendChild(infoHolder);
        let prdctImg = document.createElement("img");
        prdctImg.src = infoImgSrc;
        prdctInfo.appendChild(prdctImg);
        shopProduct.appendChild(prdctInfo);
        let btnHolder = document.createElement("div");
        btnHolder.className = "product-count";
        let btnMinus = document.createElement("button");
        btnMinus.innerHTML = "-";
        btnMinus.addEventListener("click", resolveCount);
        btnHolder.appendChild(btnMinus);
        let countNumber = document.createElement("span");
        countNumber.innerHTML = prdctCount;
        btnHolder.appendChild(countNumber);
        let btnPlus = document.createElement("button");
        btnPlus.innerHTML = "+";
        btnPlus.addEventListener("click", resolveCount);
        btnHolder.appendChild(btnPlus);
        shopProduct.appendChild(btnHolder); 
        thrdCol.appendChild(shopProduct);
        
    }
    else{
        alert("Item with that name is alredy added to cart!");
    }


}

function drawScndCol(itemName, itemDesc, itemImg, itemPrice, from = 0){
    productHolder = document.createElement("div");
    productHolder.className = "product";
    //img
    proImg = document.createElement("img");
    proImg.src = itemImg;
    proImg.className = "product-img";
    productHolder.appendChild(proImg);
    //name    
    proName = document.createElement("p");
    proName.innerHTML  = itemName;
    productHolder.appendChild(proName);
    //Price
    proPrice = document.createElement("p");
    proPrice.innerHTML = "$" + itemPrice;
    productHolder.appendChild(proPrice);
    //Btns
    detailsBtn = document.createElement("button");
    detailsBtn.className = "details-button";
    detailsBtn.innerHTML = "Details";
    detailsBtn.addEventListener("click", showModal);
    productHolder.appendChild(detailsBtn);
    //Btn buy
    buyBtn = document.createElement("button");
    buyBtn.className = "buy-button";
    buyBtn.innerHTML = "Buy";
    buyBtn.addEventListener("click", drawThrdColEvent);
    productHolder.appendChild(buyBtn);
    secndCol.appendChild(productHolder);
    if(from === 0){
        localStorageObj["items"].push([itemName, itemDesc, itemImg, itemPrice, 0]);
    }    
}


function purchase(){
    if(thrdCol.children.length > 0){
        while(thrdCol.firstChild){
            thrdCol.removeChild(thrdCol.lastChild);
        }
        for(let i = 0; i < localStorageObj["items"].length; i++){
            localStorageObj["items"][i][4] = 0;
        }
        total.children[0].innerHTML = "Total: <b>$" + 0 + "</b>";
        upload();
    }
    else{
        event.target.blur();
    }    
}


function upload(){
    fetch('https://jsonblob.com/api/jsonBlob', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'redirect': 'follow'
            },
            body: JSON.stringify(localStorageObj)
        })
        .then(function(response) {
            localStorage.setItem("store", response.headers.get('Location'))
            return response.json();
        })
        .catch((error) => {
            alert(error);
        });
}