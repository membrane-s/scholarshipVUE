import request from '@/utils/request'

// 查询奖学金与奖学金类型关联列表
export function listScholarshiptype(query) {
  return request({
    url: '/instructor/scholarshiptype/list',
    method: 'get',
    params: query
  })
}

// 查询奖学金与奖学金类型关联详细
export function getScholarshiptype(scholarshipTypeId) {
  return request({
    url: '/instructor/scholarshiptype/' + scholarshipTypeId,
    method: 'get'
  })
}

// 新增奖学金与奖学金类型关联
export function addScholarshiptype(data) {
  return request({
    url: '/instructor/scholarshiptype',
    method: 'post',
    data: data
  })
}

// 修改奖学金与奖学金类型关联
export function updateScholarshiptype(data) {
  return request({
    url: '/instructor/scholarshiptype',
    method: 'put',
    data: data
  })
}

// 删除奖学金与奖学金类型关联
export function delScholarshiptype(scholarshipTypeId) {
  return request({
    url: '/instructor/scholarshiptype/' + scholarshipTypeId,
    method: 'delete'
  })
}
