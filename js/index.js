/**
 * 将歌词格式转化成
 * {
 *   time: '',
 *   lrc: ''
 * }
 * [00:01.06]难念的经
 * @param lrc
 */
const parseLrc = (lrc) => {
  const result = []
  const array = lrc.split('\n')
  array.forEach((value) => {
    const lrcData = value.split(']')
    result.push({
      time: parseTime(lrcData[0]),
      lyric: lrcData[1]
    })
  })
  return result
}
const parseTime = (time) => {
  const timeArr = time.substring(1).split(':')
  return timeArr[0] * 60 + +timeArr[1]
}

const lrcData = parseLrc(lrc)

// 获取dom
const dom = {
  audio: document.querySelector('audio'),
  ul: document.querySelector('.container ul'),
  container: document.querySelector('.container')
}

// 计算当前播放器播放到第几秒 获取高亮显示歌词的数组下标
// 如果没有任何一句歌词需要显示则得到-1
const findIndex = () => {
  // 获取播放器当前时间
  const currentTime = dom.audio.currentTime
  return lrcData.findLastIndex((value) => {
    return value.time < currentTime
  })
}

// 创建歌词li元素
const createLyricEl = () => {
  // 优化操作dom树
  const frag = document.createDocumentFragment()
  lrcData.forEach((value) => {
    const li = document.createElement('li')
    li.textContent = value.lyric
    frag.appendChild(li)
  })
  dom.ul.appendChild(frag)
}

createLyricEl()

// container高度
let containerHeight = dom.container.clientHeight
// li高度
let liHeight = dom.ul.children[0].clientHeight
// ul高度
let ulHeight = dom.ul.clientHeight
// 最大偏移量
let maxOffset = ulHeight - containerHeight
// 设置ul元素的偏移量
const setOffset = () => {
  const index = findIndex()
  // 距离ul顶端的高度（index个li+0.5li） - container一半的高度
  let offset = liHeight * (index + 0.5) - containerHeight / 2
  if (offset < 0) {
    offset = 0
  }
  if (offset > maxOffset) {
    offset = maxOffset
  }
  // 清除active样式
  let li = dom.ul.querySelector('.active')
  if (li) {
    li.classList.remove('active')
  }

  // 重新给当前歌词添加active样式
  dom.ul.style.transform = `translateY(-${offset}px)`
  li = dom.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}

dom.audio.addEventListener('timeupdate', setOffset)

