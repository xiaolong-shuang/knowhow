const STORAGE_KEY = 'knowhow_uid'

/**
 * 获取当前浏览器的匿名用户 ID。
 * 仅在客户端可用——如果从服务端组件调用会抛出异常。
 */
export function getAnonymousId(): string {
  if (typeof window === 'undefined') {
    throw new Error('getAnonymousId() can only be called from client components')
  }
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}
