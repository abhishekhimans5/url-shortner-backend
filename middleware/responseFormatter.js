export const onSuccess = (res,data,msg,status=200) =>{
    return res.status(status).json({
        success:true,
        message: msg,
        data: data
    });
}
export const onError = (res,msg,status=500) =>{
    return res.status(status).json({
        success:false,
        message: msg
    });
}