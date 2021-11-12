import * as React from 'react'
import {useCallback, useState} from 'react'
import {Button, Input} from "antd";
import {useSelector} from "react-redux";

const {TextArea} = Input

const Actions: React.FC = () => {
  const jsSdk = useSelector<any>(state => state.jsSdk);

  const [msg, setMsg] = useState<string>('')

  const sendMsg = useCallback(async () => {
    if (!msg) alert('消息不能为空')
    if (!jsSdk) return

    // @ts-ignore
    await jsSdk.invoke('sendChatMessage', {
      msgtype: 'text',
      text: {
        content: msg
      }
    });
  }, [msg])

  return (
    <div>
      <h2>功能</h2>

      <TextArea style={{width: '100%'}} value={msg} onChange={e => setMsg(e.target.value)}/>

      <Button type="primary" onClick={sendMsg}>
        sendChatMessage
      </Button>
    </div>
  )
}

export default Actions
