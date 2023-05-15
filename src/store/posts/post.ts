import { AxiosResponse } from "axios"
import axiosIns from "@/plugins/axios"
import { ActionTree, MutationTree, Module } from "vuex"
import { IPost, IPostState } from "./types"

const state: IPostState = {
  post: {} as IPost,
}

const mutations: MutationTree<IPostState> = {
  SETPOST(state, payload: IPost) {
    state.post = payload
  },
}

const actions: ActionTree<IPostState, any> = {
  submitPost({ commit }, payload: IPost): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      // Transform post data to FormData for multipart/form-data submission
      let dataForm = new FormData()
      for (let key in payload) {
        dataForm.append(key, payload[key])
      }

      axiosIns.post(`http://127.0.0.1:5000/api/admin/new_post`, dataForm).then(res => {
        commit("SETPOST", res.data as IPost)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}

export const postStore: Module<IPostState, any> = {
  state,
  actions,
  mutations,
}
