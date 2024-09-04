import { apiRequest } from "../axios";

/**
 * 查询资产概况
 * @param data flag (0所有 1不可信 3基础可信 4智能可信)
 * @returns
 */
const assetData = async (data: any) =>
  apiRequest({ url: "host/v4/chart", data });

/**
 * 查询资产概况
 * @param data dimensionality:[1年 2月 3日 4周]
 * @param data severity:[1低 2中 3高 4严重]
 * @returns
 */
const warnTrend = async (data: any) =>
  apiRequest({ url: "alert/v4/trend", data });
const unkonwInfo = async (data: any) => apiRequest({ url: "host/chart", data });

// 发邮件
const handleEmail = async (data: any) =>
  apiRequest({ url: "email/send", data });

// 处置警告
const handle = async (data: any) =>
  apiRequest({ url: "/alert/v4/handle", data });

// 新的查询告警列表
const warnList = async (data: any) =>
  apiRequest({ url: "/alert/v4/list", data });

// 新的排名
const orderList = async (data: any) =>
  apiRequest({ url: "/alert/v4/unsafeRanking", data });

// 中间总量
const centerTotal = async (data: any) =>
  apiRequest({ url: "/alert/v4/total", data });

// 终点左侧数量
const centerLeftTotal = async (data: any) =>
  apiRequest({ url: "/host/v4/total", data });

export default {
  assetData,
  warnTrend,
  unkonwInfo,
  handle,
  warnList,
  orderList,
  centerTotal,
  handleEmail,
  centerLeftTotal,
};
