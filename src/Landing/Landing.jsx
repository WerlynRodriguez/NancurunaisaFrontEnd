import Header from './Header';
import Banner from './Banner';
import Vision from './Vision';
import Footer from './Footer';
import {Layout} from "antd";


function Landing() {
  return (
    <Layout>
      <Header/>
      <Banner/>
      <Vision/>
      <Footer/>
    </Layout>
  )
}

export default Landing
