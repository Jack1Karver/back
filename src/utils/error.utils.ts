export const errorHandler = (error: any, res: any)=>{
    if(error.code){
        return res.status(error.code).json(error.json)
    }else return res.status(500).json();
}