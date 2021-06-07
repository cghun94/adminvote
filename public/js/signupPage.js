let id_result= false;
let password_result = false;
$(document).ready(function(){    
    
    $("#id").keyup(function(){
        const id = $("#id").val();
        if(id.length < 5 || id.length >12){
            id_result = false;
            document.getElementById("result").innerText = "아이디 길이는 5~12 사이 입니다";
        }
        else{
            axios({        
                method: 'post',
                url: '/signup_id',        
                data: {        
                    id: id,              
                }        
            }).then( (res,next)=> {       
                // console.log('res.data = ', res);
                if(res.data.result === true){
                    id_result = true;
                    document.getElementById("result").innerText = "생성 가능한 아이디 입니다";
                }
                else{
                    id_result = false;
                    document.getElementById("result").innerText = "아이디 중복 입니다";
                }
            }).catch( (error )=> {
            
                // console.log(error); 
            });
        }

           
    });//id kekup

    $("#password").keyup(function(){
        const password =  $("#password").val();
        document.getElementById("result").innerText = ""
        const password_check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        if(password_check.test(password)){
            password_result = true;
            document.getElementById("result").innerText = "생성 가능합니다";
        }else{
            password_result = false;
            document.getElementById("result").innerText = "길이가 8~25 사이 \n 영어+숫자+특수문자를 입력하세요";
        }
    });//pw keyup
    
       
});//ready

function signup_click(){
    try{
        if(id_result === false || password_result === false){
            alert('생성 할수 없습니다, 조건을 확인해주세요')
        }else{
            const id = $("#id").val();
            const name = $("#name").val();
            const password =  $("#password").val();        
            axios({        
                    method: 'post',
                    url: '/signup',        
                    data: {        
                        id: id,
                        name : name,       
                        password: password        
                    }        
            }).then( (res)=> {       
                // console.log('res.data = ', res);                                
                if(res.data.result){
                    alert('생성에 성공하셨습니다.');
                    location.href='/userlist';                    
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

    }catch(err){
        console.log(err);
    }
    
           
}

