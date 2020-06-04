import request from '@/utils/request'
// 注册
export function reg(data) {
  return request({
    url: '/testApi/user/reg',
    method: 'post',
    data: data
  })
}
export function login(params) {
  return request({
    url: '/testApi/user/log',
    method: 'get',
    params: params
  })
}
export function info(params) {
  return request({
    url: '/testApi/user/info',
    method: 'get',
    params: params
  })
}
export function logout(params) {
  return request({
    url: '/testApi/user/logout',
    method: 'get',
    params: params
  })
}
// 修改个人资料
export function editUser(data) {
  return request({
    url: '/testApi/user/editUser',
    method: 'post',
    data: data
  })
}
export function selectApprovalLists(data) {
  return request({
    url: '/testApi/user/selectApprovalLists',
    method: 'post',
    data: data
  })
}
