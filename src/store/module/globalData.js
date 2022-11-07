
import Request from '@/lib/axios';

let resolveEquipment=()=>{}
const state={
  equipmentList:[],
  socketConnect:false,
  equipmentListPromise:new Promise((resolve)=>{
    resolveEquipment=resolve
  }),


};

const actions={
    equipmentList({ commit, state }){
      Request.get('/apioet/equipment/getList').then(({data})=>{
        let list=data?.data||[]
        resolveEquipment(list)
        commit('set_equipmentList', {data:list,socket:true})
        if(!state.socketConnect){
          window.dispatchEvent(new CustomEvent('myWorker__',{
            detail:{
              type:'worker__initEquipmentsSocket',
              data:list
            }
          }))
        }
      })

    }
};
const mutations ={
  set_equipmentList(state, {data,socket}){
     state.equipmentList=data
    if(socket){
      state.socketConnect=true
    }
  },
};
export default {
  namespaced:true,
  state,
  actions,
  mutations
}
