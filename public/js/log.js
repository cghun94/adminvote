$(document).ready(function(){
    let url = new URLSearchParams(location.search)
    let usersidx = url.get('usersidx')
    
    function dbData(){
        //내용물 제거
        $('#output').empty();        
        axios({        
            method: 'post',
            url: '/log',        
            data: {        
                usersidx: usersidx,         
            }        
        }).then( (res)=> {       
            console.log('res.data = ', res.data);
            $( res.data).each(function(index , item){                
                let output='';                
                output += '<tr>';
                        output += ` <td> `+ item.idx + `</td>`;
                        output += ` <td > `+ item.users_idx + ` </td>`;
                        output += ' <td>' + item.CoinName + '</td>';
                        output += ' <td>' + item.Quantity + '</td>';
                        output += ' <td >' + item.tradeQuantity + '</td>';
                        output += ' <td >' + item.NowPrice + '</td>';
                        output += ' <td >' + item.buyAmount + '</td>';
                        output += ' <td >' + item.Withdrawal + '</td>';
                        output += ' <td >' + item.AfterQuantity + '</td>';
                        output += ' <td >' + item.prevKRW + '</td>';
                        output += ' <td >' + item.AfterKRW + '</td>';
                        output += ' <td >' + item.LatestTime + '</td>';
                        // output += ` <td width = "100px"> <button type="button" class="btn" onclick="delete_click(`+ item.idx +`);"> 삭제 </button> </td>`;
                        output += '</tr>';
                $('#output').append(output); 
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
        console.log(error);
        document.getElementById("result").innerText = `${error.response.status} 에러\n ${error.response.data.message}`;
        location.href='/error';        
    });        
}


