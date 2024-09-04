/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-empty-interface */
//账号信息相关操作

import { isNull } from "@/utils";

//用户信息
export interface IUserInfo {
  /**
   * 租户ID
   */
  tenantId: string;
  /**
   * 角色名称
   */
  roleName: string;
  /**
   * 角色类型
   */
  roleType: string;
  /**
   * 登录标识
   */
  authentication: string;
  /**
   * 当前用户所有菜单信息
   */
  menuList: string;
  /**
   * 是否仅展示页面主体内容
   */
  onlyShowContent: boolean;
}

const userInfoKey = "token";

//设置用户信息
export const userAuthSet = (userInfo: any) => {
  sessionStorage.setItem(userInfoKey, userInfo);
};

//读取当前用户信息
export const userAuthGet = (): IUserInfo | null => {
  var userInfoStr = sessionStorage.getItem(userInfoKey);
  // var userInfoStr = {}
  if (isNull(userInfoStr)) {
    return null;
  }

  try {
    var userObj: IUserInfo = JSON.parse(userInfoStr!);
    return userObj;

  } catch (error) {

    return null;
  }
};

/**
 * 登出
 */
export const loginOut = () => {
  sessionStorage.removeItem(userInfoKey);
};

export interface IIsLoginRst {
  isLogin: boolean;
  authType?: 'login' | 'noLogin'
}


export const isLogin = () => {
  var userInfo = userAuthGet();
  return !isNull(userInfo?.tenantId);
}


export interface Menu {
  path: string;
  name: string;
  disabled?: boolean;
}


/**
 * 获取当前登录用户的Menu信息
 * @returns 
 */
export const currentUserMenu = (): Menu[] => {
  const  menuList  = [
    // { path:'/bigScreen',name:'首页' },
    { path:'/sysMonitor',name:'系统监控' },
    { path:'/detectWarn',name:'监测预警' },
    { path:'/attackRecall',name:'攻击回溯' },
    { path:'/assetMap',name:'资产测绘'},
    { path:'/manCenter',name:'可信管理'},
    { path:'/rulesMan',name:'规则管理' },
  ]
  if (isNull(menuList)) {
    return [];
  }
  return menuList
}


