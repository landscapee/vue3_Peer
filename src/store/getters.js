const getters = {
    getEquipmentList: (state) => state.globalData.equipmentList || [],
    getEquipmentListPromise: (state) => state.globalData.equipmentListPromise

}
export default getters
