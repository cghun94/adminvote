$(document).ready(function(){
    function dbData(){
        //내용물 제거
        $('#output').empty();
        
        //ajax 수행
        $.post('/userlist' , function(data){
            // console.log(data);
            $(data).each(function(index , item ){
                let output='';
                // console.log(item);
                    output += '<tr>';
                        output += ' <td>' + item.idx + '</td>';
                        output += ' <td>' + item.id + '</td>';
                        output += ' <td>' + item.name + '</td>';
                        output += ' <td>' + item.created_at + '</td>';
                        output += ` <td width = "100px"> <button type="button" class="btn" onclick="delete_click(`+ item.idx +`);"> 삭제 </button> </td>`;
                    output += '</tr>';
                $('#output').append(output); 
            });
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
        // console.log(error);       
    });        
}

delete_click = (ths) => {
    let num =  $(ths)[0];
    const idx = num;
    // alert('정말 삭제하시겠습니까?');
    axios({        
            method: 'post',
            url: '/delete',        
            data: {        
                idx: idx
            }        
    }).then( (res)=> {       
        console.log('res.data = ', res);                                
        if(res.data.result === true){
            
            location.href='/userlist';                    
        }
        else{
            // console.log('res.data.accessToken 토큰 없음');
            
        }
    }).catch( (error )=> {
        document.getElementById("result").innerText = `${error.response.status} 에러\n ${error.response.data.message}`;
    });        

}

