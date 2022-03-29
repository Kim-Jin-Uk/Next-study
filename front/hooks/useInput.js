import { useState, useCallback } from 'react';
//커스텀 훅 만들기
export default (initValue = null) => {
  //state 만들기
  const [value, setter] = useState(initValue);
  // handler 생성 => 이벤트 리스너
  const handler = useCallback((e) => {
    setter(e.target.value);
  }, []);
  return [value, handler,setter];
};
