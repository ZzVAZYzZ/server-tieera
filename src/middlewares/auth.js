//@param {role}
//@result next()
const auth = permission => {
    return (req,res,next) => {
        // lấy role của người dùng 
        const {role} = req.user;
        // kiểm tra nếu không có role thì trả về lỗi
        if(!role){
            res.status(400);
            throw new Error('you need sign in');
        }
        // kiểm tra nếu role không đúng 
        if(!permission.includes(role)){
            res.status(401);
            throw new Error("you don't have permission");
        }
        // nếu đúng thì cho phép đi tiếp
        next();
    }
}

module.exports = {auth}