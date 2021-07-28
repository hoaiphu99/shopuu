import mongoose from 'mongoose'
import slug from 'mongoose-slug-generator'
import mongooseDelete from 'mongoose-delete'

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      slug: 'name',
    },
  },
  {
    timestamps: true,
  }
)

// categorySchema.pre(
//   'updateOne',
//   { document: true, query: false },
//   function () {}
// )

categorySchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
})

const Category = mongoose.model('Category', categorySchema)

export default Category
