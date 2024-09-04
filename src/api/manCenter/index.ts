import { apiRequest } from "../axios";

//验证用户是否存在
const authUserSafe = async (data: any) => apiRequest({ url: "host/secLogin", data });

export default { authUserSafe };
