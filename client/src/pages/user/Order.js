import React, { useState, useEffect } from 'react';
import { getSingleOrder } from '../../functions/user';
import { useSelector } from 'react-redux';
import { Steps, Popover } from 'antd';
import { Document, Page, Text, View, StyleSheet,PDFDownloadLink,PDFViewer } from '@react-pdf/renderer';
import NumberFormat from 'react-number-format';

import Invoice from '../../components/invoice/Invoice'

const { Step } = Steps;
const Order = ({ match }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [order, setOrder] = useState({});
  const [address,setAddress]=useState({})
  const [ok,setOk]=useState('notOk')

  useEffect(() => {
    getSingleOrder(match.params.orderId, user.token).then((res) => {
      console.log(res.data);
      setOrder(res.data);
      setAddress(JSON.parse(res.data.address))

      setOk('ok')
    });
  }, []);

//  useEffect(()=>{
//    if(ok==='ok'){

//    }

//  },[ok])
  const customDot = (dot, { status, index }) => (
    <Popover
      content={
        <span>
          step {index} status: {status}
        </span>
      }
    >
      {dot}
    </Popover>
  );

  const progress=(orderStatus)=>{
    console.log(orderStatus)
    switch (orderStatus){
      case 'Not Processed':
        return  <Steps current={0} progressDot={customDot}>
        <Step title='In process' description='Processing' />
        <Step title='Waiting' description='Shipped' />
        <Step title='Waiting' description='Out for delivery' />
        <Step title='Waiting' description='Delivered' />
      </Steps>;
      case 'processing':
        return  <Steps current={0} progressDot={customDot}>
        <Step title='finished' description='Processing' />
        <Step title='Waiting' description='Shipped' />
        <Step title='Waiting' description='Out for delivery' />
        <Step title='Waiting' description='Delivered' />
      </Steps>;
      case 'Shipped':
        return <Steps current={1} progressDot={customDot}>
        <Step title='finished' description='Processing' />
        <Step title='finished' description='Shipped' />
        <Step title='Waiting' description='Out for delivery' />
        <Step title='Waiting' description='Delivered' />
      </Steps>;

      case 'Out for delivery':
        return <Steps current={2} progressDot={customDot}>
        <Step title='finished' description='Processing' />
        <Step title='finished' description='Shipped' />
        <Step title='finished' description='Out for delivery' />
        <Step title='Waiting' description='Delivered' />
      </Steps>;

      case 'Delivered':
        return <Steps current={3} progressDot={customDot}>
        <Step title='finished' description='Processing' />
        <Step title='finished' description='Shipped' />
        <Step title='finished' description='Out for delivery' />
        <Step title='finished' description='Delivered' />
      </Steps>;
    }

  }

   
  const showDownloadLink=(order,address)=>(
    <PDFDownloadLink document={
      <Invoice order={order} address={address}/>
    }
    fileName={`${order._id}_invoice.pdf`}
    >
    <i class="fas fa-file-download"></i> Invoice
    </PDFDownloadLink>
  )
  return (
    <div className='order-container'>
      <div className='orderStatus'>
      <h3>Order status</h3>
      <div className="orderStatus-head">
        <span>Order id: {order._id}</span>
        <span>{ok ==='ok'&& showDownloadLink(order,address)}</span>
        </div>
        <div className='progress'>
      { progress(order.orderStatus)}</div>
      </div>
      {order && order.paymentIntent && 
      <div>
      <div className='paymentInfo'>
      <h3>Payment info</h3>
      <span>Payment type: { order.paymentIntent.paymentIntent.payment_method_types[0]}</span>
      <span>Transaction Id: { order.paymentIntent.paymentIntent.id}</span>
      <span>Amount: &#8377;
      { order.paymentIntent.paymentIntent.amount / 100}</span>
      <span>Payment Status: { order.paymentIntent.paymentIntent.status === 'succeeded'?'Paid':'Not paid'}</span>
      </div>
      <div className="shippingAddress">
      <h3>Shipping Address</h3>
      <div>
                  <span style={{ fontWeight: '800' }}>{address.name}</span>
                  <div>
                    <span>{address.phone}</span>
                  </div>
                  <div>
                    <span>{address.house}</span>
                  </div>
                  <span>{address.street}</span>
                  <div>
                    <span>{address.landmark !== '' && address.landmark}</span>
                  </div>

                  <div>
                    <span>{address.city},</span>
                    <span>{address.state},</span>
                    <span>{address.pin}</span>
                  </div>
                  <span>{address.country}</span>
                  </div>
                </div>
      </div>
      }
      <div className="orderDetails">
      <div className="summ">
      <h3 className="order-summary-head">Order summary</h3>
      <div className="order-summary summary">
      {
        order.products && order.products.length >0 && order.products.map((c)=>(
          <div className="order-summary-item">
          <span style={{justifySelf:'flex-start'}}>{c.title}</span><span> x {c.count} =</span> <NumberFormat value= {c.price * c.count} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <span>{value}</span>} />          </div>
        ))
     
      }
      <div className="order-summary-total">
      <span>Total:</span><strong><NumberFormat value={order.totalAmount} displayType={'text'} thousandSeparator={true} prefix={` \u20B9 `} renderText={value => <span>{value}</span>} /></strong>
      <div>{order.amountAfterDiscount > 0 && `Total after discount: ${order.amountAfterDiscount}`}</div>

      </div>
      </div>
      <div>
     
      
      </div>
      </div>
      </div>
    </div>
  );
};

export default Order;
