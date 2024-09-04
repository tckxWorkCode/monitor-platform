// 申请状态 0.申请中 1.材料待审核 2.材料审核通过 3.材料审核拒绝 4.待制证 5.已拒绝
export const handleApplyOptions = [
  { label: "全部", value: "0" },
  { label: "待审核", value: "1" },
  { label: "审核通过", value: "4" },
  { label: "已拒绝", value: "5" },
  { label: "已完成", value: "6" },
];

export const levelEnum = {
  '1':"低级",
  '2':"中级",
  '3':"高级",
  '4':"严重",
}

export const newDataEnum ={
  1:'低级告警',
  2:'中级告警',
  3:"高级告警",
  4:'严重告警'
}

//home --> 告警等级
export const levelOption =[
  {label:'低级告警',value:1},
  {label:'中级告警',value:2},
  {label:'高级告警',value:3},
  {label:'严重告警',value:4},
]

// home --> 总体趋势划分
export const allOption =[
  {label:'年',value:1},
  {label:'月',value:2},
  {label:'日',value:3},
  {label:'周',value:4},
]

//系统控制--地址列表
const filesystemEnum = ['alloc_inode','destroy_inode','dirty_inode','write_inode','drop_inode','evict_inode','put_super','sync_fs','freeze_super','freeze_fs','thaw_super','unfreeze_fs','statfs','remount_fs','umount_begin','show_options','show_devname','show_path','show_stats','bdev_try_to_free_page','nr_cached_objects','free_cached_objects']
const blockdriverEnum = ['open','release','rw_page','ioctl','compat_ioctl','check_events','media_changed','unlock_native_capacity','revalidate_disk','getgeo','swap_slot_free_notify']
const scsidriverEnum = ['detect','release','info','ioctl','queuecommand','eh_abort_handler','eh_device_reset_handler','eh_target_reset_handler','eh_bus_reset_handler','eh_host_reset_handler','slave_alloc','target_alloc','target_destroy','scan_finished','scan_start','change_queue_depth','bios_param','unlock_native_capacity','show_info','write_info','eh_timed_out','host_reset']

//系统控制--跟踪点
const trackEnum = ['模块名','函数名','偏移量','长度']

export default {
  filesystemEnum,blockdriverEnum,scsidriverEnum,trackEnum
}