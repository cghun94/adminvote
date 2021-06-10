
function login_click(){
    const id = $("#id").val();
    const password =  $("#password").val();        
    axios({        
            method: 'post',
            url: '/login',        
            data: {        
                id: id,        
                password: password        
            }        
    }).then( (res)=> {       
        console.log('res.data = ', res);                                
        if(res.data.refreshToken){
            // localStorage.setItem("accessToken",res.data.accessToken)
            // let accessToken = localStorage.getItem("accessToken");                                                
            location.href='/main';                    
        }
        else{
            // console.log('res.data.accessToken 토큰 없음');
            location.href='/login';
            
        }
    }).catch( (error )=> {
        document.getElementById("result").innerText = `${error.response.status} 에러\n ${error.response.data.message}`;
        // console.log(error.response.data.message);
        location.href='/error';
    });        
}
