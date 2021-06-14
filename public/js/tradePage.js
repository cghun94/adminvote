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

coin_click = (ths) => {
    let coinname =  ths;
    console.log(coinname)
    axios({        
            method: 'get',
            url: '/tradelist/'+ coinname       
    }).then( (res)=> {       
        console.log('res.data = ', res);
        // console.log('res.data.result = ', res.data.result);
        location.href='/tradelist/' + coinname;
    }).catch( (error)=> {
        console.log(error);
        document.getElementById("result").innerText = `${error.response.status} 에러\n ${error.response.data.message}`;
        location.href='/error';        
    });        
}
