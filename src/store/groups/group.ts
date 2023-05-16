import { AxiosResponse } from "axios"
import axiosIns from "@/plugins/axios"
import { ActionTree, MutationTree, GetterTree, Module } from "vuex"
import { IGroup, IGroupState } from "./types"

const state: IGroupState = {
  groups: [] as IGroup[],
}

const mutations: MutationTree<IGroupState> = {
  SETGROUPS(state, payload: IGroup[]) {
    state.groups = payload
  },
}

const actions: ActionTree<IGroupState, any> = {
  fetchGroups({ commit }): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      axiosIns.get(`/api/admin/groups/all`).then(res => {
        commit("SETGROUPS", res.data as IGroup[])
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}

export const groupStore: Module<IGroupState, any> = {
  state,
  actions,
  mutations,
}
