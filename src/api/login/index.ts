import { apiRequest } from "../axios";

/**
 * 获取验证码
 * @param data
 * @returns
 */
const getLoginCode = async () => apiRequest({ url: "code" });

/**
 * 用户登录
 * @param data
 * @param finCb
 * @returns
 */
const userLogin = async (data: any, fin: any) => apiRequest({ url: "login",data, fin });


/**
 * 用户登出
 * @param data
 * @param finCb
 * @returns
 */
const userLogout = async (fin: any) => apiRequest({ url: "logout", fin });

export default { getLoginCode,userLogin,userLogout } 


