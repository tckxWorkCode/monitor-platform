import { apiRequest } from "../axios";

//获取host ip列表
const getHostIpInfo = async (data: any) => apiRequest({ url: "host/hostIpListV3", data });

// 获取进程数据
const getProcessInfo = async (data: any) => apiRequest({ url: "host/processSnapshootV3", data });

// 获取树节点的数据
const getNodeInfo = async (data: any,fin?:any) => apiRequest({ url: "host/processTreeByIdV3",dataType:"form", data,fin });


/**
 * 获取时间线数据
 * @param data 
 * @returns 
 */
const getTimeLineData = async (data: any,fin?:any) => apiRequest({url:'host/v4/timeLine',data,fin})

/**
 * 图例数据
 * @param data 
 * @returns 
 */
const getLegendData = async (data: any) => apiRequest({url:'host/v4/attckLegend',data});


/**
 * 时间线底部的取证信息
 * @param data 
 * @returns 
 */
const timeLineBottomInfo = async (data: any) => apiRequest({url:'host/v4/obtainEvidence',data})


export default {
  getHostIpInfo,
  getProcessInfo,
  getNodeInfo,
  getTimeLineData,
  getLegendData,
  timeLineBottomInfo,
};
