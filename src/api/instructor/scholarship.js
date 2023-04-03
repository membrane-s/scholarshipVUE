import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询奖学金信息列表
export function listScholarship(query) {
  return request({
    url: '/instructor/scholarship/list',
    method: 'get',
    params: query
  })
}

// 根据查询学生可以申请的奖学金信息列表
export function slistScholarship(query) {
  return request({
    url: '/instructor/scholarship/slist',
    method: 'get',
    params: query
  })
}

// 查询奖学金信息详细
export function getScholarship(scholarshipId) {
  return request({
    url: '/instructor/scholarship/' + parseStrEmpty(scholarshipId),
    method: 'get'
  })
}

// 新增奖学金信息
export function addScholarship(data) {
  return request({
    url: '/instructor/scholarship',
    method: 'post',
    data: data
  })
}

// 修改奖学金信息
export function updateScholarship(data) {
  return request({
    url: '/instructor/scholarship',
    method: 'put',
    data: data
  })
}

// 删除奖学金信息
export function delScholarship(scholarshipId) {
  return request({
    url: '/instructor/scholarship/' + scholarshipId,
    method: 'delete'
  })
}

