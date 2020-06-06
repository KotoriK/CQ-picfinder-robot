//bite.js
export default doBite
import config from '../config';
const setting = config.bite
/**
 * reply:{
 * success:"嗷呜~",
 * failPermitLevel:"咬..咬不到",
 * failNotAdmin:"给我一个管理我就能咬到咯",
 * failNoTarget:"要..要咬谁？",
 * failTargetIsMyself:"休想！",
 * failAnonymous:"懒得写匿名兼容了一律禁言嘻嘻"
 * }
 */
const myQQid = setting.myQQid
const roleLevel = {
    member: 0,
    admin: 1,
    owner: 2
}
let pics = []
let cacheMyRole = []


/**
 *
 *
 * @param {Object} context 消息对象
 * @param {function} replyFunc 回复的回调函数
 * @param {Object} bot 
 * @returns {boolean},passthrough:false,handled:true
 */
function doBite(context, replyFunc, bot) {
    let re = /^竹竹[^我他她它\s]+([我他她它])$/.exec(context)
    if (!re) return false; //检查是否符合RegEx
    let anonymous=context.anonymous, biteWho = re[1]
    if (anonymous) //检查是否是匿名消息
        {
            bot('set_group_anonymous_ban', {
                group_id: context.group_id,
                flag: anonymous.flag,
                duration: 10*60
            });
            if(biteWho=="我"){
                replyFunc(context, setting.reply.success, true)
            }else{
                replyFunc(context, setting.reply.failAnonymous, true)
            }
            return true;
        }
    let bite_user_id=context.user_id
    if (biteWho != "我") {  //咬别人    
        //检测有没有at
        bite_user_id = getAt(context.message)
        if (!bite_user_id) { //返回false 未获取到at qq号
            replyFunc(context, setting.reply.failNoTarget, true)
            return true;
        }else{
            if(bite_user_id==myQQid){//不准咬竹竹！
                replyFunc(context,setting.reply.failTargetIsMyself,true)
                return true;
            }
        }
    }
    const myRoleLevel = checkMyRole(context.group_id)
    if (myRoleLevel > roleLevel.member) { //检查我是否是管理员
        if (checkRoleLevel(context.group_id, bite_user_id) < myRoleLevel) {
            bot('set_group_ban', {
                group_id: context.group_id,
                user_id: bite_user_id,
                duration: 60
            });
        }else{
            replyFunc(context, setting.reply.failPermitLevel, true)
            return true;
        }
        //reply success
        replyFunc(context, setting.reply.success, true)
        return true;
        //replyFunc(context, base64 ? CQcode.img64(base64) : CQcode.img(url))  //发图片
    } else {
        //reply failure
        replyFunc(context, setting.reply.failNotAdmin, true)
        return true;

    }
}

function checkMyRole(group_id, use_cache = false) {
    if (use_cache) {
        if (cacheMyRole[group_id] == undefined) //缓存中不存在
        {
            return get()
        } else {
            return cacheMyRole[group_id]
        }
    } else {
        return get()
    }

    function get() {
        checkRoleLevel(group_id, myQQid)
        //todo:refresh cache
    }
}

function checkRoleLevel(group_id, user_id) {
    bot('get_group_member_info', {
        group_id: group_id,
        user_id: user_id,
        no_cache: true,
    })
}

/**
 * 获取at的qq号
 * 
 * @param {*} msg context.message
 * @returns
 */
function getAt(msg) {
    const reg = /\[CQ:at,qq:([0-9]+)\]/;
    let result = reg.exec(msg)
    return result ? result : false
}
/////