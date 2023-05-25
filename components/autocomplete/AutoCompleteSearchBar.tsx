import { AutoComplete, Button, Col, Form, Row, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { handleDistance, searchPlaces } from '../redux/commonAction';
import { useAppDispatch, useAppSelector } from '../redux/store';
import axios from 'axios';
import { setGeoData, setIsLoading } from '../redux/commonReducer';

// Import Constants
 const { Text } = Typography

const AutoCompleteSearchBar = ({setSelectLocationFrom, setSelectLocationTo, selectLocationFrom, selectLocationTo }:any) => {

  const places:any = useAppSelector(state => state?.common?.search_places ?? [])
  const dispatch = useAppDispatch()
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
    setSelectLocationFrom({...selectedOption, pointType: 'From'});
    setAnotherOptionsFrom(selectedOption?.value)
  };
  const onSelectTo = (value:any) => {
    const selectedOption:any = options.find((option:any) => option.value === value);
    setSelectLocationTo({...selectedOption, pointType: 'To'});
    setAnotherOptionsTo(selectedOption?.value)
  };

  const loading:any = useAppSelector(state => state?.common?.isLoading ?? '')

  const handleClick = () => {
    dispatch(handleDistance({selectLocationFrom, selectLocationTo}))
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
            <Button type="primary" loading={loading} onClick={()=> handleClick()}> { 'Submit' } </Button>
        </div>
    </Form>
  )
}

export default AutoCompleteSearchBar