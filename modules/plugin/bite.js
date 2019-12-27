//bite.js
export default doBite
const setting = config.bite
const myQQid = setting.myQQid
let pics = []
let cacheAdmin = []

function doBite(context) {
    if (/^竹竹[^我\s]+我$/.exec(context)) {//检查是否符合RegEx
        if (checkIfIAmAdmin) { //检查是否是管理员
            return bot('set_group_ban', {
                group_id: context.group_id,
                user_id: at ? CQ.at(context.user_id) + msg : msg,
                duration: 60
            });
            //reply success
        } else {
            //reply failure
            
        }
    } else {
        //do nothing
    }
}

function checkIfIAmAdmin(group_id, use_cache) {
    if (use_cache) {
        if (cacheAdmin[group_id] == undefined) //缓存中不存在
        {
            return get()
        } else {
            return cacheAdmin[group_id]
        }
    } else {
        return get()
    }

    function get() {
        bot('get_group_member_info', {
            group_id: group_id,
            user_id: myQQid,
            no_cache: true,
        })

        //todo:refresh cache
    }
}
/////