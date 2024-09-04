/* eslint-disable @typescript-eslint/no-empty-function */
import { isNull, blobToStr, isObject } from "@/utils";
import { showMsg } from "@/components/Tip";
import axios, { AxiosResponse } from "axios";
import loginApi from "./login";
import { reidrect } from "@/router";
import { useRouter } from "vue-router";

/**
 * api请求地址
 * @returns
 */
export const getBaseUrl = () => process.env.VUE_APP_API_PREFIX;


/**
 * 接口请求超时时间
 * @returns
 */
export const getTimeOut = () => 30000;

/**
 * axios访问实例
 */
export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: getTimeOut(),
});

/**
 * http请求参数
 */
export interface IHttpRequestParams {
  /**
   * 请求地址
   */
  url?: string;
  /**
   * 请求数据 如需上传文件，此处应为FormData
   */
  data?: any;
  /**
   * 请求方式 默认为post
   */
  requestType?: "post" | "get";
  /**
   * 数据类型 默认为json
   */
  dataType?: "form" | "json";
  /**
   * 是否将参数格式化为formdata
   */
  formatToFormData?: boolean;
  /**
   * 请求异常回调
   * @param msg
   * @returns
   */
  onError?: (msg: string) => void;
  /**
   * 请求完毕回调
   * @returns
   */
  fin?: () => void;
  /**
   * 请求错误是否提示错误信息 默认为提示
   */
  tipError?: boolean;
  /**
   * 数据响应类型
   */
  responseType?: "json" | "blob";
  /**
   * 超时时长
   */
  timeout?: number;
}

/**
 * 给请求参数赋予默认值
 * @param params
 */
const initHttpRequestParams = (params: IHttpRequestParams) => {
  if (isNull(params.requestType)) {
    params.requestType = "post";
  }
  if (isNull(params.dataType)) {
    params.dataType = "json";
  }
  if (isNull(params.tipError)) {
    params.tipError = true;
  }
  if (
    params.formatToFormData &&
    !isNull(params.data) &&
    isObject(params.data)
  ) {
    const formData = new FormData();
    for (const key in params.data) {
      if (Object.prototype.hasOwnProperty.call(params.data, key)) {
        const element = params.data[key];
        formData.append(key, element);
      }
    }
    params.data = formData;
  }
};

/**
 * 生成请求头
 * @param params
 * @returns
 */
const initHttpRequestHeader = async (
  params: IHttpRequestParams
): Promise<any> => {
  const header: any = {};

  if (params.requestType === "post") {
    header["Content-Type"] =
      params.dataType === "json"
        ? "application/json"
        : "application/x-www-form-urlencoded";
  }

  //如果需要添加token 请在这里填写
  // var userInfo = getAuth();
  const token = sessionStorage.getItem("token");
  const sid = sessionStorage.getItem("sid");
  const username = sessionStorage.getItem("uname");
  if (token) {
    header["token"] = token;
  }
  if (sid) {
    header["sid"] = sid;
  }
  if (username) {
    header["username"] = username;
  }

  return header;
};

/**
 * 当请求错误时，提示错误
 */
const tipError = (
  isTip: boolean,
  msg: string,
  callback?: (msg: string) => void
) => {
  if (!isNull(msg) && msg.indexOf("timeout") != -1) {
    msg = "请求超时";
    reidrect("/login");
  }

  callback?.(msg);
  if (!isTip) {
    return;
  }
  //在这里书写提示错误相关代码，如Modal.Error
  showMsg("error", msg);
};

/**
 * 通用Http请求
 * @param params
 * @returns
 */
export const apiRequest = async (params: IHttpRequestParams) => {

  // if(!sessionStorage.getItem('uname')){
  //   return reidrect('/login');
  // }

  if (isNull(params)) {
    return Promise.reject("请传入请求参数");
  }

  //完善请求参数
  initHttpRequestParams(params);

  try {
    //填充头部信息
    const headers = await initHttpRequestHeader(params);

    let reponse: AxiosResponse<any>;
    if (params.requestType === "post") {
      reponse = await axiosInstance.post("/api/" + params.url, params.data, {
        headers,
        timeout: params.timeout,
      });
      
      // reponse = await axiosInstance.post(params.url, { headers, params: params.data, responseType: params.responseType, timeout: params.timeout });
    } else {
      reponse = await axiosInstance.get("/api/" + params.url, {
        headers,
        params: params.data,
        responseType: params.responseType,
        timeout: params.timeout,
      });
    }
    

    let rspData = reponse?.data;

    if (params.responseType === "blob") {
      if (reponse.headers["content-type"] === "application/json") {
        //如果响应是json代表请求出错
        try {
          const dataStr = await blobToStr(rspData as any);
          rspData = JSON.parse(dataStr);
        } catch (error) {
          rspData = { code: -1, message: "未知的异常" };
        }
      } else {
        //这种情况是真实的文件响应,返回固定的结果
        let fileName = params.data;
        //读取文件名
        const fileContent: string = reponse.headers["content-disposition"];
        if (fileContent) {
          const start = fileContent.indexOf("fileName=");
          if (start != -1) {
            const fileNameStr = fileContent.substring(start + 9);
            fileName = decodeURIComponent(fileNameStr);
          } 
        }
        return Promise.resolve({ fileName, fileBlob: rspData });
      }
    }
    const { code, data, msg } = rspData || {};
    if(code == 1002 || code ==1001){
      showMsg("error", msg);
      return Promise.resolve(rspData);
    }
    if (code == 1004  || code == 1003) {
      showMsg("error", msg);
      // await loginApi.userLogout(() => { })
      setTimeout(() => {
        reidrect("/login");
      }, 200);
      sessionStorage.removeItem("useremail");
      sessionStorage.removeItem("Authentication");
      return Promise.reject("登录失效,请重新登录");
    }

    if(msg == "SUCCESS"){
      return Promise.resolve(code)
    }
    
    if (!data) {
      showMsg("error", msg);
      return Promise.resolve(rspData);
    }
    
    
    if(msg == "QUERY FOUND NONE"){
      return Promise.resolve({
        list:[]
      })
    }

    if (code == 0 || code == 200) {
      // params.tipError && showMsg('error', '后台服务异常：无效的响应内容');
      return Promise.resolve(data);
    }

    //不等于200是错误
    if (code !== 200) {
      //登录失效

      //其他错误
      tipError(params.tipError!, msg ? msg : "", params.onError);
      return Promise.reject(msg ? msg : "");
    }
    
    return Promise.resolve(data);
  } catch (error) {
    // reidrect('/login')
    tipError(params.tipError!, error?.message, params.onError);
    return Promise.reject(error);
  } finally {
    params.fin?.();
  }
};

/**
 * 触发responseType是blob的文件下载
 * @param file
 * @param fileName
 */
export const triggerDownload = (rsp: any,otherName) => {
  const eleLink = document.createElement("a");
  eleLink.download = rsp.fileName+"."+otherName;
  eleLink.href = window.URL.createObjectURL(new Blob([rsp.fileBlob],{type:otherName}));
  eleLink.click();
  window.URL.revokeObjectURL(eleLink.href);
};
