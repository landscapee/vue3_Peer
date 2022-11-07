import moment from 'moment';
export const dataBaseConfig = () => {
    return [
        {type:'index',label:'序号' ,width:49,align:'center'},
        {
            label: 'ID', prop: 'id', format: row => {
                return row?.id
            },align:'center'
        },
        {label: '触发条件', prop: 'Monitor',align:'center'},
        {label: '监测结果', prop: 'Sites',align:'center'},
        {label: '定位?', prop: 'Completed',align:'center'},
        {label: '位置1', prop: 'Loc1',align:'center'},
        {label: '位置2', prop: 'Loc2',align:'center'},
        {label: '位置3', prop: 'Loc3',align:'center'},
        {label: '位置4', prop: 'Loc4',align:'center'},
        {label: '定位时间', prop: 'DoneTime',align:'center'},
        {label: '项目名称', prop: 'ProjName',align:'center'},
        {slot:'option'}
    ]
};
export const equipmentConfig = () => {

    return [
        {type:'index',label:'序号' ,width:49,align:'center'},

        {label: '设备名称', prop: 'name',align:'center'},
        {label: '设备编号', prop: 'code',align:'center'},
        {label: '设备类型', prop: 'type',align:'center'},
        {slot:'position'},
        {label: 'IP端口', prop: 'ip',align:'center'},
        {slot:'status'},
        {label: '创建时间', prop: 'createTime',align:'center',format:(row)=>{
                return row.createTime? moment(row.createTime).format('YYYY-MM-DD HH:mm:ss'):'--'
            }},

        {slot:'equipmentManage'},
        {slot:'option'}
    ]
}