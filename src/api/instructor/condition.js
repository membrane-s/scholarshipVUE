import request from '@/utils/request'

// 查询申请条件列表
export function listCondition(query) {
  return request({
    url: '/instructor/condition/list',
    method: 'get',
    params: query
  })
}

// 查询奖金对应申请条件列表
export function slistCondition(scholarshipId) {
  return request({
    url: '/instructor/condition/slistCondition/' + scholarshipId,
    method: 'get',
  })
}

// 查询申请条件详细
export function getCondition(conditionId) {
  return request({
    url: '/instructor/condition/' + conditionId,
    method: 'get'
  })
}

// 新增申请条件
export function addCondition(data) {
  return request({
    url: '/instructor/condition',
    method: 'post',
    data: data
  })
}

// 修改申请条件
export function updateCondition(data) {
  return request({
    url: '/instructor/condition',
    method: 'put',
    data: data
  })
}

// 删除申请条件
export function delCondition(conditionId) {
  return request({
    url: '/instructor/condition/' + conditionId,
    method: 'delete'
  })
}
