import { Col, Row } from 'antd'
import React, { useState } from 'react'
import AutoCompleteSearchBar from './AutoCompleteSearchBar'
import AutoCompleteMap from './AutoCompleteMap'

const MainContainer = () => {
  const [selectLocationFrom, setSelectLocationFrom]:any = useState(null);
  const [selectLocationTo, setSelectLocationTo]:any = useState(null);

  return (
    <div style={{padding: "30px", height: '100vh', backgroundColor: "white"}}>
      <Row gutter={50}>
        <Col span='8' >
          <AutoCompleteSearchBar selectLocationFrom={selectLocationFrom} selectLocationTo={selectLocationTo} setSelectLocationFrom={setSelectLocationFrom} setSelectLocationTo={setSelectLocationTo}/>
        </Col>
        <Col span='16'>
          <AutoCompleteMap selectLocationFrom={selectLocationFrom} selectLocationTo={selectLocationTo} />
        </Col>
      </Row>
    </div>
  )
}

export default MainContainer