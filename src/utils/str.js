// 定义高亮文字的方法
export const lightFn = (str, target) => {
  const reg = new RegExp(target, 'ig')
  return str.replace(reg, math => {
    return `<span style="color:red">${math}</span>`
  })
}
