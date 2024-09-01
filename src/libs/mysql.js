import  mysql  from "serverless-mysql";

export const conn = mysql({
        config:{
            host: 'app.rms.com.co',
            user: 'rmsapp',
            password: 'rms123**',
            port:3306,
            database: 'productscrud'
        }
    })