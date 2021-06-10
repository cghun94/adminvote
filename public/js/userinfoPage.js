$(document).ready(function(){
    let url = new URLSearchParams(location.search)
    let usersidx = url.get('usersidx')
    
    function dbData(){
        
        //내용물 제거
        $('#aip').empty();        
        // ajax 수행
        axios({        
            method: 'post',
            url: '/userlist/userinfo/aip',        
            data: {        
                usersidx: usersidx,         
            }        
        }).then( (res)=> {       
            console.log('res.data = ', res.data);
            $( res.data).each(function(index , item){
                let output='';                
                    output += '<tr>';
                        output += ' <td>' + item.idx + '</td>';
                        output += ` <td> <button type="button" class="btn" onclick="user_click(`+ item.idx +`);"> `+ item.users_idx + `</button> </td>`;
                        output += ` <td "> <button type="button" class="btn" onclick="user_click(`+ item.idx +`);"> `+ item.total + `</button> </td>`;
                        output += ' <td>' + item.buy + '</td>';
                        output += ' <td>' + item.sell + '</td>';
                        output += ' <td >' + item.trade_time + '</td>';
                        // output += ` <td width = "100px"> <button type="button" class="btn" onclick="delete_click(`+ item.idx +`);"> 삭제 </button> </td>`;
                    output += '</tr>';
                $('#aip').append(output); 
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

