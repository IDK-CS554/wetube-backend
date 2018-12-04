const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.listen(5000, () => {
  console.log(`Backend is listening on ${PORT}`)
})
