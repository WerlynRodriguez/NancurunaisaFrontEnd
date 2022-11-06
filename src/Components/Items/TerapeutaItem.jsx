import "./TeraTaItem.css";
import {Row,Col,Avatar, Badge, Typography, Checkbox, Space} from "antd";
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { CheckCircleFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

function useLongPress(callback = () => {}, ms = 300) {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(callback, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [callback, ms, startLongPress]);

  const start = useCallback(() => {
    setStartLongPress(true);
  }, []);
  const stop = useCallback(() => {
    setStartLongPress(false);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}

export default function TerapeutaItem(props){
    let {
      item,
      onClick,
      onLongPress,
      mulSelMode} = props;

    const useLP = useLongPress(() => {onLongPress(item)}, 800);

    return (
      <Row
      {...useLP}
      onClick={()=>{onClick(item)}}
      className="comunItem"
      style={{backgroundColor: item.selected? "rgba(89,32,133, 0.2)": "white"}}>

        <Col span={item.selected? 2 : 0} 
        style={{textAlign:"center"}}>
          <CheckCircleFilled style={{fontSize:"20px"}}/>
        </Col>
        
        <Col span={4} style={{textAlign:"center"}}>
          <Avatar
          size="large"
          src={item.pic}>
            {item.pic? null:item.info[0][0]}
          </Avatar>
        </Col>

        <Col span={item.selected ? 16 : 18}>
          <Title style={{fontSize:16,margin:0,padding:0}}>
            {item.info[0]}
          </Title>
          <Text style={{fontSize:12}}>
            {item.info[1]}
          </Text>
        </Col>

        <Col span={2}>
          <Badge status={item.status? "success":"error"} />
        </Col>
      </Row>
    )
}