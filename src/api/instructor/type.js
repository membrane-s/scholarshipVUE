import request from '@/utils/request'

// 查询奖学金类型列表
export function listType(query) {
  return request({
    url: '/instructor/type/list',
    method: 'get',
    params: query
  })
}

// 查询奖学金类型详细
export function getType(scholarshipTypeId) {
  return request({
    url: '/instructor/type/' + scholarshipTypeId,
    method: 'get'
  })
}

// 新增奖学金类型
export function addType(data) {
  return request({
    url: '/instructor/type',
    method: 'post',
    data: data
  })
}

// 修改奖学金类型
export function updateType(data) {
  return request({
    url: '/instructor/type',
    method: 'put',
    data: data
  })
}

// 删除奖学金类型
export function delType(scholarshipTypeId) {
  return request({
    url: '/instructor/type/' + scholarshipTypeId,
    method: 'delete'
  })
}
