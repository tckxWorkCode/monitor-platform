import { isNull } from "@/utils";
import { ElMessage, ElMessageBox } from "element-plus"

/**
 * 提示等级
 */
export type TipLevel = 'success' | 'error' | 'warning';

/**
 * 非强提示
 * @param level 
 * @param msg 
 * @returns 
 */
export const showMsg = (level: TipLevel, msg: string) => {
    if (isNull(msg)) {
        return;
    }
    switch (level) {
        case 'success':
            ElMessage.success(msg);
            break;
        case 'error':
            ElMessage.error(msg);
            break;
        case 'warning':
            ElMessage.warning(msg);
            break;
    }
}

/**
 * 强弹窗提示  ***按下esc不会关闭弹窗
 * @param level 
 * @param msg 
 * @param title 
 */
export const confirmMsg = async (level: TipLevel, msg: string, title: string = '提示') => {
    if (isNull(msg)) {
        return;
    }
    await ElMessageBox.alert(msg, title, { type: level, showClose: false });
}

/**
 * 需要用户点击确认或者取消的提示
 * @param level 
 * @param msg 
 * @param title 
 */
export const confirmOptMsg = async (level: TipLevel, msg: string, title: string = '提示') => {
    if (isNull(msg)) {
        return;
    }
    await ElMessageBox.confirm(msg, title, { type: level, showClose: false });
}

