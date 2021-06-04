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


