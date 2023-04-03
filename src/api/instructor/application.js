import request from '@/utils/request'

// 查询奖学金申请列表
export function listApplication(query) {
  return request({
    url: '/instructor/application/list',
    method: 'get',
    params: query
  })
}

// 查询奖学金申请列表
export function slistApplication(query) {
  return request({
    url: '/instructor/application/slist',
    method: 'get',
    params: query
  })
}

// 查询学生已经申请的奖学金记录
export function applicationlist(query) {
  return request({
    url: '/instructor/application/applicationlist',
    method: 'get',
    params: query
  })
}


// 查询奖学金申请详细
export function getApplication(applicationId) {
  return request({
    url: '/instructor/application/' + applicationId,
    method: 'get'
  })
}

// 新增奖学金申请
export function addApplication(data) {
  return request({
    url: '/instructor/application',
    method: 'post',
    data: data
  })
}

// 修改奖学金申请
export function updateApplication(data) {
  return request({
    url: '/instructor/application',
    method: 'put',
    data: data
  })
}

// 删除奖学金申请
export function delApplication(applicationId) {
  return request({
    url: '/instructor/application/' + applicationId,
    method: 'delete'
  })
}
