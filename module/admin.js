const router = require('express').Router();
const Conn = require('./../config/database').cgh;
let wheresql = null;
let sql = null;
let data;

module.exports = {
    /**
     * 
     * @param {String} where 'where email = ? and password = ?'
     * @param {Array} param 
     * @param {String} what 
     */
    getRow : async (wheresql ,param) => {
        if(wheresql && param){
            sql = `select * from Admin ${wheresql} `;
            [data] = await Conn.query(sql, param )
        }
        else{
            [data] = await Conn.query(sql, param )
        }
        // console.log(data[0]);
        return data[0]
    },
    
    getList : function(){

    },
    addRow : function(){

    },
    ModRow : function(){

    },
    delRow :function(){

    },
    addSql : function(){

    },
}