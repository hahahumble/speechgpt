import requests from './request'
export const reqModels = ()=>requests({url:'models',method:'get'})
export const reqCompletions = (data:object)=>requests({url:'chat/completions',method:'post',data})