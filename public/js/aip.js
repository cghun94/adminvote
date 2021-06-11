function logout(){
    axios({        
            method: 'post',
            url: '/logout'       
    }).then( (res)=> {       
        console.log('res.data = ', res);
        // console.log('res.data.result = ', res.data.result);
        if(res.data.accessToken){
            console.log('res.data.token = x ');
        }else{
            location.href='/' ;                    
        }
    }).catch( (error)=> {
        console.log(error);
        document.getElementById("result").innerText = `${error.response.status} 에러\n ${error.response.data.message}`;
        location.href='/error';        
    });        
}
function buyAmount(){
    let buyNowPrice = $("#buyNowPrice").val();
    // console.log(buy)
    let buyQuantity = $("#buyQuantity").val();
    // console.log(buyQuantity)
    let buyAmount = buyNowPrice * buyQuantity;
    buyAmount = Math.ceil(buyAmount)
    console.log(buyAmount)
    $('#buyAmount').val(buyAmount);
}
function sellAmount(){
    let sellNowPrice = $("#sellNowPrice").val();
    // console.log(buy)
    let sellQuantity = $("#sellQuantity").val();
    // console.log(buyQuantity)
    let sellAmount = sellNowPrice * sellQuantity;
    sellAmount = Math.ceil(sellAmount)
    // console.log(buyAmount)
    $('#sellAmount').val(sellAmount);
}


function buy_click(){
    const buyNowPrice = $("#buyNowPrice").val();
    const buyQuantity = $("#buyQuantity").val();
    const buyAmount = $("#buyAmount").val();
    // console.log(buyAmount)       
    axios({        
            method: 'post',
            url: '/tradelist/aip',        
            data: {        
                coin : 'AIP',
                NowPrice : buyNowPrice,
                buyQuantity : buyQuantity,
                buyAmount: buyAmount,
            }        
    }).then( (res)=> {       
        console.log('res.data = ', res);                                
        
    }).catch( (error )=> {
        document.getElementById("result").innerText = `${error.response.status} 에러\n ${error.response.data.message}`;
        // console.log(error.response.data.message);
        location.href='/error';
    });
}


