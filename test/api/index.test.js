const chai=require('chai')
const chaiHttp=require('chai-http')
const should=chai.should();

const server=require('../../app')

chai.use(chaiHttp)  

describe('Node Server',()=>{
    it('Run the Home Page (GET/)',(done)=>{
          //localhost:3000/
        chai.request(server)
            .get("/")
            .end((err,res)=>{
               res.should.have.status(200)
               done();
            })
      
    })
  //   // it('Run the Movie Page (GET/movie)',(done)=>{
  //   //   done();
  // })
})