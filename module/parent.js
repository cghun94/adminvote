// const Conn = require('./../config/database').api();
// let sql ,data;

// module.exports = {
//     /**
//      * 
//      * @param {String} where 'where email = ? and password = ?'
//      * @param {Array} param 
//      * @param {String} what 
//      */
//     getRow : async (wheresql ,param) => {
//         if(wheresql && param){
//             sql = `select * from parent ${wheresql} `;
//             [data] = await Conn.query(sql, param )
//         }
//         else{
//             [data] = await Conn.query(sql, param )
//         }
//         // console.log(data[0]);
//         return data[0]
//     },
    
//     getList : async() =>{
//         console.log('getList 1')
//         sql = 'select * from parent order by salt desc limit 10'
//         data = await Conn.query(sql);        
//         console.log(data);
//         return
//     },
//     addRow : function(){

//     },
//     ModRow : function(){

//     },
//     delRow :function(){

//     },
//     addSql : function(){

//     },
// }