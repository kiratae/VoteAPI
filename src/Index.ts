import "reflect-metadata";
import app from './WebService/App'

const port = process.env.PORT || 3000

app.listen(port, () => {
  return console.log(`server is listening on ${port}`)
})