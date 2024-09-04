import { apiRequest } from "../axios";

//获取系统监控列表
const getListInfo = async (data: any) => apiRequest({ url: "host/list", data });

//获取host ip列表
const getHostIpInfo = async (data: any) => apiRequest({ url: "host/hostIpListV3", data });

/**
 * 获取终端详细信息
 * @param data id
 * @returns 
 */
const detailNodeInfo = async (data: any,fin?:any) => apiRequest({ url: "host/v4/memInfo", data,fin });

/**
 * 进程列表详情
 * @param data 
 * @returns 
 */
const getNewDetail = async (data: any) => apiRequest({url:'host/v4/processDetail',data})


/**
 * 跟踪点详情
 * @param data 
 * @returns 
 */
const getTrackDetail = async (data: any) => apiRequest({url:'host/v4/tracePointDetail',data})

/**
 * 实时行为监控列表
 * @param data 
 * @returns 
 */
const getRealTimeList = async (data: any) => apiRequest({url:'host/v4/behaviorMonitor',data})

/**
 * 定时刷新列表
 * @param data 
 * @returns 
 */
const reloadRealList = async (data:any) => apiRequest({url:'host/v4/monitorInfo',data})

export default { getListInfo,getHostIpInfo,detailNodeInfo,getNewDetail,getRealTimeList,reloadRealList,getTrackDetail };
