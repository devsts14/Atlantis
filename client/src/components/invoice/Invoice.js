import React from 'react'
import { Document, Page, Text, View, StyleSheet,PDFDownloadLink,PDFViewer } from '@react-pdf/renderer';
import {Table,TableHeader,TableCell,TableBody,DataTableCell} from '@david.kucsai/react-pdf-table'
import moment from 'moment'

const Invoice = ({order,address}) => {

  return (
    order &&
    
    <Document>
    {console.log(order)}
      <Page style={styles.body} >
      <Text style={styles.header} fixed>~{new Date().toLocaleString()}~</Text>
       <Text style={styles.author}>Order Invoice</Text>
       <Text style={styles.title}>Atlantis</Text>
       <Text style={styles.subtitle}>Order summary</Text>

<Table>
<TableHeader>
<TableCell>Title</TableCell>
<TableCell>Price</TableCell>
<TableCell>Quantity</TableCell>
</TableHeader>
</Table>

<Table data={order.products}>
<TableBody>
<DataTableCell getContent={(x)=>x.title}/>

<DataTableCell getContent={(x)=>x.price}/>
<DataTableCell getContent={(x)=>x.count}/>
</TableBody>
</Table>

<Text style={styles.text}>
<Text>Date: {'                '}{moment(order.createdAt).format("MMM Do YY")}</Text>
{`\n`}
<Text>Order Id:{'         '}{order._id}</Text>
{`\n`}

<Text>Order Status:{'   '}{order.orderStatus}</Text>
{`\n`}

<Text>Total Paid:{'       '}{order.paymentIntent.paymentIntent.amount / 100}</Text>
{`\n`}


</Text>
<Text style={styles.footer}>~ Thank you for shopping with Atlantis~</Text>

      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  footer: {
    padding: "100px",
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});
export default Invoice
