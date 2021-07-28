import mongoose from 'mongoose'
import slug from 'mongoose-slug-generator'
import mongooseDelete from 'mongoose-delete'

const brandSchema = mongoose.Schema(
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

// brandSchema.pre(
//   'updateOne',
//   { document: true, query: false },
//   function () {}
// )

brandSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
})

const Brand = mongoose.model('Brand', brandSchema)

export default Brand
