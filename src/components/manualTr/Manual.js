import React from 'react'
import '../../assets/Stylesheets/Manual.css'
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import VerifyHash from './VerifyHash';


const Manual = (props) => {

  let {
    re_coinname
  } = props.data

  let [coin] = useState(re_coinname)

  return (

    <>

      <div className='col-md-6 mx-auto mt-6'>

        <div style={{
          border: "2px solid black",
          padding: "20px",
          borderRadius: "7px",
          marginTop: "10px",
          height: '25%',
          width: '100%'
        }}>

          <Form.Group className="mb-3">
            <Form.Label>selected Coin</Form.Label>
            <input className='formInput' type='text' disabled value={re_coinname} />
          </Form.Group>


        </div>

      </div>

      {
        coin ? <VerifyHash coinName={coin} props={props} /> : null
      }

    </>

  )
}

export default Manual