
import { apiRequest } from "../axios";

//验证用户是否有权限
const authUserSafe = async (data: any) => apiRequest({ url: "user/query",requestType:'get', data });

export default { authUserSafe };
