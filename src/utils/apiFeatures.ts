class ApiFeatures {
  query: any
  constructor(query: any, public queryObj: any) {
    this.query = query
    this.queryObj = queryObj
  }

  filter() {
    // filter query
    const newQueryObj: {
      [key: string]: number | string
    } = { ...this.queryObj }
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword', 'populate']
    excludedFields.forEach((el) => delete newQueryObj[el])

    // Advanced filtering
    let queryStr = JSON.stringify(newQueryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  search() {
    if (this.queryObj.keyword) {
      const regex = new RegExp(this.queryObj.keyword, 'i')
      // this.query = this.query.or({ $text: { $search: this.queryObj.keyword } })
      this.query = this.query.or([{ name: { $regex: regex } }, { originalName: { $regex: regex } }])
    }
    return this
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    }
    return this
  }

  fields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate() {
    // console.log('KEY', this.queryObj.keyword)

    if (!this.queryObj.keyword) {
      const page = this.queryObj.page * 1 >= 1 ? this.queryObj.page * 1 : 1
      const limit = this.queryObj.limit * 1 >= 1 ? this.queryObj.limit * 1 : 1000
      const skip = (page - 1) * limit
      this.query = this.query.skip(skip).limit(limit)
    }
    return this
  }
}

export default ApiFeatures
