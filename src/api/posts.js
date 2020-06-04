import request from '@/utils/request'

export function selectClassification(data) {
  return request({
    url: '/testApi/posts/selectClassification',
    method: 'post',
    data: data
  })
}

export function addPosts(data) {
  return request({
    url: '/testApi/posts/addPosts',
    method: 'post',
    data: data
  })
}

export function selectPosts(data) {
  return request({
    url: '/testApi/posts/selectPosts',
    method: 'post',
    data: data
  })
}

export function infoPosts(data) {
  return request({
    url: '/testApi/posts/infoPosts',
    method: 'post',
    data: data
  })
}
// 创建评论
export function replyPosts(data) {
  return request({
    url: '/testApi/posts/replyPosts',
    method: 'post',
    data: data
  })
}

// 创建子评论
export function replyChildPosts(data) {
  return request({
    url: '/testApi/posts/replyChildPosts',
    method: 'post',
    data: data
  })
}
// 评论列表
export function selectReplyPosts(data) {
  return request({
    url: '/testApi/posts/selectReplyPosts',
    method: 'post',
    data: data
  })
}

// 关注板块
export function addFollow(data) {
  return request({
    url: '/testApi/posts/addFollow',
    method: 'post',
    data: data
  })
}
export function selectFollow(data) {
  return request({
    url: '/testApi/posts/selectFollow',
    method: 'post',
    data: data
  })
}
export function selectMinePosts(data) {
  return request({
    url: '/testApi/posts/selectMinePosts',
    method: 'post',
    data: data
  })
}
export function selectMineFollow(data) {
  return request({
    url: '/testApi/posts/selectMineFollow',
    method: 'post',
    data: data
  })
}
export function selectCommentNum(data) {
  return request({
    url: '/testApi/posts/selectCommentNum',
    method: 'post',
    data: data
  })
}
export function delFollow(data) {
  return request({
    url: '/testApi/posts/delFollow',
    method: 'post',
    data: data
  })
}
// 收藏
export function addCollection(data) {
  return request({
    url: '/testApi/posts/addCollection',
    method: 'post',
    data: data
  })
}
export function selectMineCollection(data) {
  return request({
    url: '/testApi/posts/selectMineCollection',
    method: 'post',
    data: data
  })
}
export function delCollection(data) {
  return request({
    url: '/testApi/posts/delCollection',
    method: 'post',
    data: data
  })
}
