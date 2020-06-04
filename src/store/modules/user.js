// import { login, logout, getInfo } from '@/api/user'
import { login, info, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     userInfo: ''
//   }
// }

const state = {
  token: getToken(),
  userInfo: ''
}

const mutations = {
  SET_NAME: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    console.log(userInfo, 'postData11111')
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // console.log(postData, 'postData2222')
      login({ username: username, password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        info({ token: data.token }).then(res => {
          console.log(res, 'res')
          sessionStorage.setItem('userInfo', JSON.stringify(res.data))
          commit('SET_NAME', res.data)
          resolve(res.data)
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       console.log(state.token, 'state.token')
  //       const { data } = response

  //       if (!data) {
  //         reject('Verification failed, please Login again.')
  //       }

  //       const { name, avatar } = data

  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ token: state.token }).then(() => {
        removeToken() // must remove  token  first
        // resetRouter()
        commit('SET_TOKEN', '')
        sessionStorage.clear()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     removeToken() // must remove  token  first
  //     commit('RESET_STATE')
  //     resolve()
  //   })
  // }
}

export default {
  state,
  mutations,
  actions
}

