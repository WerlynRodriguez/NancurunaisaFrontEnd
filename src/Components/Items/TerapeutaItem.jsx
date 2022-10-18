import "./TeraTaItem.css";
import {Row,Col,Avatar, Badge, Checkbox, Space} from "antd";
import React, {useCallback, useEffect, useMemo, useRef} from 'react';

function useLongPress({
    onClick = () => {},
    onLongPress = () => {},
    ms = 300,
  } = {}) {
    const timerRef = useRef(false);
    const eventRef = useRef({});
  
    const callback = useCallback(() => {
      onLongPress(eventRef.current);
      eventRef.current = {};
      timerRef.current = false;
    }, [onLongPress]);
  
    const start = useCallback(
      (ev) => {
        ev.persist();
        eventRef.current = ev;
        timerRef.current = setTimeout(callback, ms);
      },
      [callback, ms]
    );
  
    const stop = useCallback(
      (ev) => {
        ev.persist();
        eventRef.current = ev;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          onClick(eventRef.current);
          timerRef.current = false;
          eventRef.current = {};
        }
      },
      [onClick]
    );
  
    return useMemo(
      () => ({
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
      }),
      [start, stop]
    );
  }

export default function TeraTaItem(props){
    let {item,onClick,onLongPress,mulSelMode} = props;

    // Validate if the variable is a function, if true, execute it
    const ejectFunction = (func) => {
        if (typeof func === 'function') {
            func(item);
        }
    }

    const longPressProps = useLongPress({
        onClick: (ev) => ejectFunction(onClick),
        onLongPress: (ev) => ejectFunction(onLongPress),
      });

    return (<div style={{width:"100%",display:"flex",flexDirection:"row"}}>
    <div style={{width:"10%",display:mulSelMode?"flex":"none",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <Checkbox 
        checked={item.selected} 
        onChange={()=>{ejectFunction(onClick)}}/>
    </div>

    <Row {...longPressProps} className="ItemTera">
        <Col className="ColCardIcon" span={6}>

            <Avatar 
            size="large" 
            src={item.pic? item.pic:null}>
                {item.pic? null:item.title[0]}
            </Avatar>
        </Col>
        <Col span={2}/>
        <Col span={16}>
            {item.title}
        </Col>
    </Row>
    </div>);
}