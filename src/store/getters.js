const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo
}
console.log(getters.userInfo)
export default getters
