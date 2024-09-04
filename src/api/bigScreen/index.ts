import { apiRequest } from "../axios";



/**
 * 告警分析  第一条数据
 * @param data
 * @param finCb
 * @returns
 */
const waringAnalyzeA = async (data: any, fin: any) => apiRequest({ url: "alert/trendA", data, fin });

/**
 * 告警分析  第二条数据
 * @param data
 * @param finCb
 * @returns
 */
const waringAnalyzeB = async (data: any, fin: any) => apiRequest({ url: "alert/trendB", data, fin });
/**
 * 资产概况
 * @param data
 * @param finCb
 * @returns
 */
const assetsAll = async (data: any, fin: any) => apiRequest({ url: "host/chart", data, fin });

/**
 * 系统调用  柱状图和饼状图
 * @param data
 * @param finCb
 * @returns
 */
const sysCall = async (data: any, fin: any) => apiRequest({ url: "alert/chartA", data, fin });

/**
 * 周期告警 柱状图和饼状图
 * @param data
 * @param finCb
 * @returns
 */
const cycleWaring = async (data: any, fin: any) => apiRequest({ url: "alert/chartB", data, fin });

//获取资产视图的可信根信息
const believeInfo = async (data: any) => apiRequest({ url: "host/assetView",data });

// 资产信息-可信评分
const believeLevel = async (data: any) => apiRequest({ url: "host/trustCount",data });

// 威胁分布
const theartInfo = async (data: any) => apiRequest({ url: "host/assetRisk",data });

// 未知资产概况
const unKnowInfo = async (data: any) => apiRequest({ url: "host/unknownAsset",data})

// 告警列表
const warnList = async (data: any) => apiRequest({ url:"alert/listA",data})
// 周期性列表
const warnInfoList = async (data: any) => apiRequest({ url:"alert/listB",data})


// 告警趋势
const warnTrendInfo = async (data:any) => apiRequest({url:"alert/trendA",data})

// 告警占比
const warnProporInfo = async (data:any) => apiRequest({url:"alert/chartA",data})

// 可信告警
const newTrust = async (data:any) => apiRequest({url:'alert/v4/listC',data})

// 周期性列表
const attackBackList = async (data: any) => apiRequest({ url:"alert/v4/listD",data})

// 处置警告
const handle = async (data:any) => apiRequest({url:'',data})

export default {
    waringAnalyzeA,waringAnalyzeB,assetsAll,sysCall,cycleWaring,
    believeInfo,believeLevel,theartInfo,unKnowInfo,warnList,warnTrendInfo,warnProporInfo,
    warnInfoList,
    newTrust,handle,
    attackBackList
}


