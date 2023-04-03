import request from '@/utils/request'

// 查询审核意见列表
export function listOpinion(query) {
  return request({
    url: '/instructor/opinion/list',
    method: 'get',
    params: query
  })
}

// 查询审核意见详细
export function getOpinion(reviewId) {
  return request({
    url: '/instructor/opinion/' + reviewId,
    method: 'get'
  })
}

// 新增审核意见
export function addOpinion(data) {
  return request({
    url: '/instructor/opinion',
    method: 'post',
    data: data
  })
}

// 修改审核意见
export function updateOpinion(data) {
  return request({
    url: '/instructor/opinion',
    method: 'put',
    data: data
  })
}

// 删除审核意见
export function delOpinion(reviewId) {
  return request({
    url: '/instructor/opinion/' + reviewId,
    method: 'delete'
  })
}
