const dayjs = require('dayjs')

module.exports = {
  name: "File",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar"
    },
    type: {
      type: "varchar"
    },
    end_time:{
      type: "varchar"
    },
    created:{
      type: "timestamp",
      default: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  }
};