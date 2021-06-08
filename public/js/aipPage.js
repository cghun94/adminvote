$(document).ready(function(){
    function dbData(){
        //내용물 제거
        $('#output').empty();
        
        //ajax 수행
        $.post('/aip' , function(data){
            console.log(data);
            $(data).each(function(index , item ){
                let output='';
                // console.log(item);
                    output += '<tr>';
                        output += ' <td>' + item.num + '</td>';
                        output += ' <td>' + item.users_idx + '</td>';
                        output += ' <td>' + item.total + '</td>';
                        output += ' <td>' + item.buy + '</td>';
                        output += ' <td>' + item.sell + '</td>';
                        output += ' <td>' + item.created_at + '</td>';
                        // output += ` <td width = "100px"> <button type="button" class="btn" onclick="delete_click(`+ item.idx +`);"> 삭제 </button> </td>`;
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
        console.log(error);        
    });        
}