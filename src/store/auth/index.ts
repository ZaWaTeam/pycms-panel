import { AxiosResponse } from "axios"
import axiosIns from "@/plugins/axios"
import { ActionTree, MutationTree, GetterTree, Module } from "vuex"
import { IAuthCredentials, IAuthState, IUserCredentials, IUserLogin } from "./types"

const state: IAuthState = {
  logged: false,
  user: {} as IUserCredentials,
}

const mutations: MutationTree<IAuthState> = {
  SETUSER(state, payload: IUserCredentials) {
    state.user = payload
  },
  SETAUTHENTICATION(state, payload: IAuthCredentials) {
    axiosIns.defaults.headers.common["Authorization"] = `${payload.type} ${payload.access_token}`
    localStorage.setItem("_auth.token", payload.access_token)
    localStorage.setItem("_auth.expires", payload.expires_in.toString())
    state.logged = true
  },
}

const actions: ActionTree<IAuthState, any> = {
  defineUser({ commit }): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      axiosIns.get(`api/admin/user`).then(res => {
        commit("SETUSER", res.data as IUserCredentials)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  login({ commit }, payload: IUserLogin): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      // DataFrom used to make post, put, patch requests
      let dataForm = new FormData()
      dataForm.append("username", payload.username)
      dataForm.append("password", payload.password)

      axiosIns.post(`api/admin/login`, dataForm).then(res => {
        commit("SETAUTHENTICATION", res.data as IUserCredentials)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  isAuthenticated({
    commit,
    dispatch,
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("_auth.token")

      if (!token) {
        reject()
      }

      dispatch("defineUser").then(res => {
        axiosIns.defaults.headers.common["Authorization"] = `Bearer ${token}`
        resolve()
      }).catch(err => {
        reject()
      })
    })
  },
}

export const authStore: Module<IAuthState, any> = {
  state,
  actions,
  mutations,
}
