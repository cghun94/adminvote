
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
        if(res.data.accessToken){
            // localStorage.setItem("accessToken",res.data.accessToken)
            // let accessToken = localStorage.getItem("accessToken");                                                
            location.href='/main' ;                    
        }
        else{
            // console.log('res.data.accessToken 토큰 없음');
            
        }
    }).catch( (error )=> {
        
        if(error.response.status === 400 ){
            document.getElementById("result").innerText = "아이디가 틀렸거나 없습니다."
        }
        if(error.response.status === 401 ){
            document.getElementById("result").innerText = "비밀번호가 틀렸습니다."
        }
        // console.log(error); 
    });        
}
