import { AutoComplete, Button, Col, Form, Row, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { searchPlaces } from '../redux/commonAction';
import { useAppDispatch, useAppSelector } from '../redux/store';
import axios from 'axios';
import { setGeoData } from '../redux/commonReducer';

// Import Constants
 const { Text } = Typography

const AutoCompleteSearchBar = ({setSelectLocationFrom, setSelectLocationTo, selectLocationFrom, selectLocationTo }:any) => {

  const places:any = useAppSelector(state => state?.common?.search_places ?? [])

  const dispatch = useAppDispatch()
  const [value, setValue] = useState('');
  const [anotherOptionsFrom, setAnotherOptionsFrom]:any = useState('');
  const [anotherOptionsTo, setAnotherOptionsTo]:any = useState('');

  const [options, setOptions] = useState([]);
  const onChange = async (value:any) => {
    if (value) {
      try {
        dispatch(searchPlaces(value))
        const newOptions = places?.map((result:any) => ({
          key: result.id,
          value: result.Address,
          label: result.Address,
          longitude: Number(result.longitude),
          latitude: Number(result.latitude),
        }));
        setOptions(newOptions);
      } catch (error) {
        console.error(error);
      }
    } else {
      setOptions([]);
    }
  };

  const onSelectFrom = (value:any) => {
    const selectedOption:any = options.find((option:any) => option.value === value);
    console.log(selectedOption)
    setSelectLocationFrom(selectedOption);
    setAnotherOptionsFrom(selectedOption?.value)
  };
  const onSelectTo = (value:any) => {
    const selectedOption:any = options.find((option:any) => option.value === value);
    console.log(selectedOption)
    setSelectLocationTo(selectedOption);
    setAnotherOptionsTo(selectedOption?.value)
  };

  const handleDistance = async (fromValue: any, toValue:any) =>{
    const url = `https://geoserver.bmapsbd.com/gh/route?point=${fromValue.latitude},${fromValue.longitude}&point=${toValue.latitude},${toValue.longitude}&locale=en-us&elevation=false&profile=car&optimize=%22true%22&use_miles=false&layer=Barikoi&points_encoded=false`
    try {
        const res = await axios.get(url);
        console.log(res)
        dispatch(setGeoData(res?.data))
      } catch (err) {
        console.error(err);
      }
    console.log(fromValue, toValue)
  }


  return (
    <Form>
        <Row style={{flexDirection: 'column'}} gutter={[30, 30]}>
            <Col style={{display: 'flex', flexDirection: 'column'}}>
                <Text>From: </Text>
                <AutoComplete
                    value={anotherOptionsFrom}
                    options={options}
                    style={{ width: '100%'}}
                    onSelect={onSelectFrom}
                    onChange={onChange}
                    onSearch={(text)=> setAnotherOptionsFrom(text)}
                    placeholder="control mode"
                />
            </Col>
            <Col style={{display: 'flex', flexDirection: 'column'}}>
                <Text>To: </Text>
                <AutoComplete
                    value={anotherOptionsTo}
                    options={options}
                    style={{ width: '100%' }}
                    onSelect={onSelectTo}
                    onChange={onChange}
                    onSearch={(text)=> setAnotherOptionsTo(text)}
                    placeholder="control mode"
                />
            </Col>
        </Row>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
            <Button type="primary" onClick={()=> handleDistance(selectLocationFrom, selectLocationTo)}> { 'Submit' } </Button>
        </div>
    </Form>
  )
}

export default AutoCompleteSearchBar