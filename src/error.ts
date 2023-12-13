export class UserError extends Error{
    code:string;
    sqlError?:any;
    constructor(code:string, message?:string, sqlError?:any){
        super(message);
        this.code = code;
        this.sqlError = sqlError;
    }
}