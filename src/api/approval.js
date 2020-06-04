import request from '@/utils/request'

export function selectApprovalLists(data) {
  return request({
    url: '/testApi/user/selectApprovalLists',
    method: 'post',
    data: data
  })
}
export function addApproval(data) {
  return request({
    url: '/testApi/user/addApproval',
    method: 'post',
    data: data
  })
}
