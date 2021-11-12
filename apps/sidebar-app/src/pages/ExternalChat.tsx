import * as React from 'react'
import {useEffect, useState} from 'react'
import {fetchExternalChat} from '../api'
import {Spin} from "antd";
import {useSelector} from "react-redux";

const ExternalChat: React.FC = () => {
  const jsSdk = useSelector<any>(state => state.jsSdk);

  const [loading, setLoading] = useState<boolean>()
  const [externalChat, setExternalChat] = useState<ExternalChatResponse['group_chat'] | void>()

  const getExternalChatInfo = async () => {
    if (!jsSdk) return

    // @ts-ignore
    const res = await jsSdk.invoke<{chatId?: string}>('getCurExternalChat', {})

    if (!res || !res.chatId) return

    console.log('外部联系群 ID', res.chatId);

    const chatInfo = await fetchExternalChat(res.chatId || '').catch(e => console.error(e))

    setExternalChat(chatInfo)
  }

  useEffect(() => {
    getExternalChatInfo()
      .finally(() => setLoading(false))
  }, [])

  const openUserProfile = (userId: string, type: 1 | 2) => {
    // @ts-ignore
    return jsSdk.invoke('openUserProfile', {
      userid: userId,
      type,
    })
  }

  return (
    <Spin spinning={loading}>
      <div>
        <h2>外部联系群</h2>
        {externalChat ? (
          <div>
            <p>群名: {externalChat.name}</p>
            <p>群主: {externalChat.owner}</p>
            <p>群公告: {externalChat.notice}</p>
            <p>群成员: </p>
            <ul>
              {externalChat.member_list.map(m => (
                <li key={m.userid}>
                  <a onClick={() => openUserProfile(m.userid, m.type)}>
                    {m.userid}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : <p>找不到外部联系群</p>}
      </div>
    </Spin>
  )
}

export default ExternalChat
