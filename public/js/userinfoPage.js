$(document).ready(function(){
    let url = new URLSearchParams(location.search)
    let usersidx = url.get('usersidx')
    
    function dbData(){

        //내용물 제거
        $('#Asset').empty();        
        axios({        
            method: 'post',
            url: '/userlist/userAsset',        
            data: {        
                usersidx: usersidx,         
            }        
        }).then( (res)=> {       
            console.log('res.data = ', res.data);
            $( res.data).each(function(index , item){                
                let Asset='';                
                Asset += '<tr>';
                        Asset += ` <td> `+ item.CoinName + `</td>`;//코인명
                        
                        Asset += ' <td>' + item.AfterQuantity + '</td>'; //보유 수량
                        
                        Asset += ' <td >' + item.LatestTime + '</td>'; //최근거래
                        // output += ` <td width = "100px"> <button type="button" class="btn" onclick="delete_click(`+ item.idx +`);"> 삭제 </button> </td>`;
                        Asset += '</tr>';
                $('#Asset').append(Asset); 
            });                              
            
        }).catch( (error )=> {
            // console.log(error.response.data.message);
            location.href='/error';
        });
        
    }//function dbData
    dbData();
});
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
        document.getElementById("result").innerText = `${error.response.status} 에러\n ${error.response.data.message}`;
        location.href='/error';
        // console.log(error);       
    });        
}

