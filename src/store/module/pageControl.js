let state={
    test:{}
}
let actions={
    getTest({commit,state},val){
        return state.test;
    },

}
let mutations={

    setTest:(state,val)=>{
        state.test=val;
    } ,


}
export default {
    namespaced:true,
    state,
    actions,
    mutations
}
