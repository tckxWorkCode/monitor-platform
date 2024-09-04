import { apiRequest } from './../axios';

//  中心规则的列表
const centerRulesList = async (data: any) => apiRequest({ url: "rule/list", data });

//终端规则列表
const nodeRulesList = async (data: any) => apiRequest({ url: "tr/list", data });

//中心规则列表
const manList = async (data: any) => apiRequest({ url: "ta/list", data });

// 导入规则包
const impRule = async (data: any,fin:any) => apiRequest({ url: "rule/import", data,dataType:'form',fin, });

// 规则类型（第一个下拉框内容）
const firstSelect = async(data:any)=>apiRequest({url:'rule/customRuleFields',data})

// 规则类型（第二个下拉框内容）
const secondSelect = async(data:any)=>apiRequest({url:'rule/customRuleFieldsValue',data,dataType:"form"})

// 创建规则
const createRule = async(data:any,fin:any)=>apiRequest({url:'rule/upsert',data,fin})

// 详情
const detailInfo = async(data:any)=>apiRequest({url:`rule/detail?id=${data}`})

// 删除规则 [{id:''},{id:''}]
const delRule = async(data:any,fin:any)=>apiRequest({url:'rule/delete',data,fin})

// 导出规则
const exportRule = async(data:any)=>apiRequest({url:'rule/export',data,responseType:'blob'})

// 开启/关闭状态  开启[{id:'',enabled:false}]  关闭[{id:'',enabled:true}]
const optEnable = async(data:any,fin:any)=>apiRequest({url:'rule/enable',data,fin})


// 管理-->关联规则
const relevanceList = async(data:any,fin:any)=>apiRequest({url:'ta/refRule',data,dataType:'form',fin})

// 管理-->关联规则-->是否启用
const ruleStateswitch = async(data:any)=>apiRequest({url:'ta/enable',data})

// 管理(终端代理-->下发)
const sendNode = async(data:any)=>apiRequest({url:"ta/send",data})

// 终端规则-->删除规则
const nodeDelete = async(data:any)=>apiRequest({url:'tr/delete',data})

// 终端规则-->导出规则
const nodeExportRule = async(data:any)=>apiRequest({url:'tr/export',data:''})

// 终端规则-->导入规则
const nodeImportRule = async(data:any,fin:any)=>apiRequest({url:'tr/import',data,dataType:'form',fin})

export default { 
    centerRulesList,nodeRulesList,manList,impRule,
    firstSelect,secondSelect,detailInfo,delRule,createRule,exportRule,optEnable,relevanceList,ruleStateswitch,
    nodeDelete,nodeExportRule,nodeImportRule,sendNode
};